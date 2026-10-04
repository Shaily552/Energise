
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from statistics import median

app = FastAPI(
    title="Energise ML Service",
    description="Energy anomaly detection and short-term forecasting",
    version="1.0.0",
)


class AnalysisRequest(BaseModel):
    readings: List[float] = Field(min_length=5)
    unit: str = "kWh"
    data_source: str = "user-provided"


def analyse_readings(readings: List[float], unit: str, data_source: str):
    if len(readings) < 5:
        raise HTTPException(
            status_code=400,
            detail="Provide at least 5 readings for analysis.",
        )

    if any(value < 0 for value in readings):
        raise HTTPException(
            status_code=400,
            detail="Energy readings cannot be negative.",
        )

    center = median(readings)
    deviations = [abs(value - center) for value in readings]
    mad = median(deviations)

    # Median absolute deviation is robust to occasional extreme readings.
    threshold = 3.5 * 1.4826 * mad
    if mad == 0:
        ordered = sorted(readings)
        q1 = ordered[len(ordered) // 4]
        q3 = ordered[(3 * len(ordered)) // 4]
        threshold = max((q3 - q1) * 1.5, abs(center) * 0.10, 1.0)

    anomalies = [
        {
            "index": index,
            "reading": value,
            "deviation": round(value - center, 2),
            "type": "high" if value > center else "low",
        }
        for index, value in enumerate(readings)
        if abs(value - center) > threshold
    ]

    # Fit a simple straight-line trend, excluding detected anomalies.
    clean = [
        (index, value)
        for index, value in enumerate(readings)
        if not any(item["index"] == index for item in anomalies)
    ]
    if len(clean) < 2:
        clean = list(enumerate(readings))

    xs = [item[0] for item in clean]
    ys = [item[1] for item in clean]
    mean_x = sum(xs) / len(xs)
    mean_y = sum(ys) / len(ys)
    denominator = sum((x - mean_x) ** 2 for x in xs)
    slope = (
        sum((x - mean_x) * (y - mean_y) for x, y in clean) / denominator
        if denominator
        else 0.0
    )
    forecast = max(0.0, mean_y + slope * (len(readings) - mean_x))

    return {
        "anomalyCount": len(anomalies),
        "anomalies": anomalies,
        "forecast": round(forecast, 2),
        "unit": unit,
        "median": round(center, 2),
        "readingsAnalyzed": len(readings),
        "dataSource": data_source,
        "method": "Median absolute deviation + linear trend",
        "notice": (
            "Illustrative analysis; validate against real time-series data "
            "before using for operational decisions."
            if data_source == "sample"
            else "Results depend on the quality and representativeness of the supplied readings."
        ),
    }


@app.get("/")
def home():
    return {"message": "Energise ML Service is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
def analyze(request: AnalysisRequest):
    return analyse_readings(
        request.readings,
        request.unit,
        request.data_source,
    )


@app.get("/demo-analysis")
def demo_analysis():
    sample_readings = [38, 40, 39, 41, 42, 40, 43, 44, 41, 95]
    return analyse_readings(sample_readings, "kWh", "sample")
