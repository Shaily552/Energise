
from fastapi import FastAPI

app = FastAPI(title="Energise ML Service")


@app.get("/")
def home():
    return {"message": "Energise ML Service is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
