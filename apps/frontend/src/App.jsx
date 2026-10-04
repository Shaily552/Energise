import { useEffect, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  CircleHelp,
  Factory,
  Gauge,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  Menu,
  Settings,
  Zap,
  TrendingUp,
  Wrench,
  Clock,
  CircleCheck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./App.css";
const energyData = [
  { time: "08 AM", usage: 82 },
  { time: "09 AM", usage: 110 },
  { time: "10 AM", usage: 104 },
  { time: "11 AM", usage: 138 },
  { time: "12 PM", usage: 126 },
  { time: "01 PM", usage: 155 },
  { time: "02 PM", usage: 132 },
  { time: "03 PM", usage: 118 },
  { time: "04 PM", usage: 95 },
  { time: "05 PM", usage: 74 },
];
const sampleMachines = [
  { name: "Air Compressor 01", type: "Compressed air", usage: 32.4, status: "Normal" },
  { name: "Injection Moulding 02", type: "Production line", usage: 48.2, status: "Attention" },
  { name: "Cooling System 01", type: "Cooling", usage: 21.8, status: "Normal" },
];
const recommendations = [
  {
    title: "Review Injection Moulding 02",
    category: "ENERGY EFFICIENCY",
    description:
      "Its sample energy profile is above the expected operating range. Review machine settings and recent production conditions before making changes.",
    saving: 500,
    icon: Zap,
    tone: "amber",
  },
  {
    title: "Inspect compressor idle time",
    category: "OPERATIONAL CHECK",
    description:
      "Review whether the compressor can safely reduce running time during production breaks.",
    saving: 250,
    icon: Activity,
    tone: "green",
  },
];
const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Energy analytics", icon: Activity },
  { label: "Machines", icon: Factory },
  { label: "Recommendations", icon: Lightbulb },
];
function MetricCard({ title, value, unit, note, icon: Icon, tone = "green" }) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <span className={`metric-icon ${tone}`}>
          <Icon size={18} />
        </span>
      </div>
      <div className="metric-value">
        {value} {unit && <span>{unit}</span>}
      </div>
      <div className="metric-foot neutral">{note}</div>
    </article>
  );
}
function PageHeading({ title, description, period, setPeriod }) {
  return (
    <section className="page-heading">
      <div>
        <div className="eyebrow">ENERGY INTELLIGENCE</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="heading-actions">
        <span className="updated-label">
          <span className="status-dot" /> Sample data
        </span>
        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          aria-label="Time period"
        >
          <option>Today</option>
          <option>This week</option>
          <option>This month</option>
        </select>
      </div>
    </section>
  );
}
function EnergyChart({ data = energyData, height = 280 }) {
  return (
    <div className="chart-container" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#31845b" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#31845b" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#edf0ed" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: "#89938c", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tick={{ fill: "#89938c", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e7ebe7", fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="usage"
            name="Energy (kWh)"
            stroke="#31845b"
            strokeWidth={2.5}
            fill="url(#energyFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
function MachinesTable({ onViewAll, machines = [], sourceLabel = "Sample data" }) {
  return (
    <section className="panel machines-panel">
      <div className="panel-heading">
        <div>
          <h2>Machine performance</h2>
          <p>A quick look at equipment energy usage</p>
        </div>
        <button className="text-button" onClick={onViewAll}>
          View all machines <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Machine</th>
              <th>Energy used</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {machines.map((machine) => {
              const status = machine.status?.toLowerCase();
const needsAttention =
  status !== "running" && status !== "normal";
              return (
                <tr key={machine.id ?? machine.name}>
                  <td>
                    <span className="machine-symbol">
                      <Factory size={17} />
                    </span>
                    <strong>{machine.name}</strong>
                  </td>
                  <td className="usage-cell">
                    {machine.energyConsumption ?? machine.usage} kWh
                  </td>
                  <td>
                    <span
                      className={`machine-status ${
                        needsAttention ? "attention" : "normal"
                      }`}
                    >
                      <span />
                      {machine.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="row-action"
                      aria-label={`View ${machine.name}`}
                      onClick={onViewAll}
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="table-foot">
        <span>Showing {machines.length} machines</span>
        <span>{sourceLabel}</span>
      </div>
    </section>
  );
}
function OverviewPage({ period, setPeriod, setActiveNav, apiMachines, overview, apiRecommendations, apiAlerts, apiError,  mlAnalysis,
  mlError, }){
  return (
    <>
      <PageHeading
        title="Good morning"
        description="Here's what's happening across your factory today."
        period={period}
        setPeriod={setPeriod}
      />
      <section className="metrics-grid">
        <MetricCard title="Energy consumed" value={(overview?.energyConsumed ?? 1240).toLocaleString("en-IN")} unit={overview?.energyUnit ?? "kWh"} note={!overview ? "Waiting for backend" : overview.dataSource === "sample" ? "Illustrative backend value" : "Reported by backend"} icon={Zap} />
        <MetricCard title="Energy cost" value={`â‚¹${(overview?.estimatedCost ?? 9920).toLocaleString("en-IN")}`} note={!overview ? "Waiting for backend" : overview.dataSource === "sample" ? "Illustrative estimate" : "Reported by backend"} icon={Activity} tone="amber" />
        <MetricCard title="Carbon emissions" value={(overview?.emissions ?? 1023).toLocaleString("en-IN")} note="Sample value; unit needs confirmation" icon={Leaf} tone="blue" />
        <MetricCard title="Efficiency alerts" value={String(apiAlerts.length).padStart(2, "0")} unit="open" note={`${apiAlerts.filter((alert) => ["high", "critical"].includes(String(alert.severity).toLowerCase())).length} high priority`} icon={Gauge} tone="rose" />
      </section>
      <section className="dashboard-grid">
        <article className="panel energy-panel">
          <div className="panel-heading">
            <div><h2>Energy consumption</h2><p>Hourly electricity usage across your factory</p></div>
            <span className="subtle-button"><span className="legend-dot" /> Electricity</span>
          </div>
          <div className="chart-summary"><strong>{(overview?.energyConsumed ?? 1240).toLocaleString("en-IN")} <span>{overview?.energyUnit ?? "kWh"}</span></strong><span className="chart-change"><ArrowDownRight size={15} /> {!overview ? "Waiting for backend" : overview.dataSource === "sample" ? "Illustrative estimate" : "Reported total"}</span></div>
          <EnergyChart height={250} />
          <div className="chart-footnote"><span><span className="legend-dot" /> Sample hourly profile</span><span>Hourly readings not yet connected</span></div>
        </article>
        <article className="panel recommendation-panel">
          <div className="panel-heading"><div><h2>Recommended for you</h2><p>Actions returned by the recommendations API</p></div><span className="recommendation-count">{apiRecommendations.length}</span></div>
          {apiRecommendations.length ? apiRecommendations.map((item) => (
            <div className="recommendation-item" key={item.id ?? item.title}>
              <div className="recommendation-icon amber"><Zap size={18} /></div>
              <div className="recommendation-body">
                <span className="priority">{item.category ?? "EFFICIENCY OPPORTUNITY"}</span>
                <h3>{item.title}</h3>
                <p>{item.description ?? "Review this opportunity against current operating conditions before making changes."}</p>
                <div className="potential-saving">Potential savings: <strong>â‚¹{Number(item.estimatedSavings ?? item.saving ?? 0).toLocaleString("en-IN")}/{String(item.unit ?? "estimate").replace(/^INR\//i, "")}</strong></div>
              </div>
              <ArrowUpRight className="recommendation-arrow" size={17} />
            </div>
          )) : <p className="estimate-note">No recommendations were returned by the API.</p>}
          <p className="estimate-note">Savings are estimates and have not been verified against measured production data.</p>
          <button className="text-button" onClick={() => setActiveNav("Recommendations")}>View recommendations <ArrowUpRight size={15} /></button>
        </article>
      </section>

<section className="panel ml-insights-panel">
  <div className="panel-heading">
    <div>
      <h2>AI energy insights</h2>
      <p>Anomaly detection and next-reading forecast</p>
    </div>
    <span className="recommendation-count">
      {mlAnalysis ? `${mlAnalysis.anomalyCount} anomalies` : "ML"}
    </span>
  </div>

  {mlError && <p className="estimate-note">{mlError}</p>}

  {mlAnalysis && (
    <>
      <div className="metrics-grid">
        <MetricCard
          title="Anomalies detected"
          value={mlAnalysis.anomalyCount}
          note="In the analyzed readings"
          icon={Activity}
          tone="amber"
        />
        <MetricCard
          title="Next-reading forecast"
          value={mlAnalysis.forecast}
          unit={mlAnalysis.unit}
          note="Trend-based estimate"
          icon={TrendingUp}
          tone="blue"
        />
        <MetricCard
          title="Median consumption"
          value={mlAnalysis.median}
          unit={mlAnalysis.unit}
          note="Historical reference"
          icon={Gauge}
        />
      </div>

      {mlAnalysis.anomalies.length > 0 ? (
        <div className="recommendation-item">
          <div className="recommendation-icon amber">
            <Activity size={18} />
          </div>
          <div className="recommendation-body">
            <h3>Unusual energy reading detected</h3>
            {mlAnalysis.anomalies.map((anomaly) => (
              <p key={anomaly.index}>
                Reading {anomaly.index + 1}: {anomaly.reading}{" "}
                {mlAnalysis.unit} ({anomaly.type} consumption).
              </p>
            ))}
          </div>
        </div>
      ) : (
        <p className="estimate-note">
          No anomalies detected in these readings.
        </p>
      )}

      <p className="estimate-note">{mlAnalysis.notice}</p>
      <p className="estimate-note">
        Data source: {mlAnalysis.dataSource}
      </p>
    </>
  )}
</section>

      <MachinesTable
        machines={apiMachines.length ? apiMachines : sampleMachines}
        sourceLabel={apiMachines.length ? "MongoDB-backed API" : "Fallback sample data"}
        onViewAll={() => setActiveNav("Machines")}
      />
    </>
  );
}
function AnalyticsPage({ period, setPeriod }) {
  const multiplier = period === "This week" ? 6.4 : period === "This month" ? 25 : 1;
  const total = Math.round(1240 * multiplier);
  const chartData = period === "Today"
    ? energyData
    : energyData.map((item, index) => ({
        ...item,
        usage: Math.round(item.usage * (period === "This week" ? 1.12 : 1.24) + (index % 3) * 7),
      }));
  return (
    <>
      <PageHeading title="Energy analytics" description="Explore consumption patterns and identify opportunities for efficiency." period={period} setPeriod={setPeriod} />
      <section className="metrics-grid">
        <MetricCard title="Energy consumed" value={total.toLocaleString("en-IN")} unit="kWh" note={`Illustrative ${period.toLowerCase()} total`} icon={Zap} />
        <MetricCard title="Average hourly use" value={Math.round(total / (period === "Today" ? 10 : period === "This week" ? 70 : 300))} unit="kWh" note="Calculated from sample data" icon={Activity} tone="blue" />
        <MetricCard title="Peak usage" value={`${Math.max(...chartData.map((d) => d.usage))}`} unit="kWh" note="Highest sample interval" icon={TrendingUp} tone="amber" />
        <MetricCard title="Baseline comparison" value="âˆ’8%" note="Illustrative comparison" icon={Leaf} />
      </section>
      <section className="panel energy-panel">
        <div className="panel-heading"><div><h2>Consumption trend</h2><p>Sample interval usage for {period.toLowerCase()}</p></div><span className="subtle-button"><span className="legend-dot" /> Electricity</span></div>
        <EnergyChart data={chartData} height={340} />
        <div className="chart-footnote"><span><span className="legend-dot" /> Sample consumption</span><span>Replace with measured readings when connected</span></div>
      </section>
      <section className="panel">
        <div className="panel-heading"><div><h2>What to look for</h2><p>Questions that can guide an energy review</p></div></div>
        <div className="recommendation-item"><div className="recommendation-icon amber"><TrendingUp size={18} /></div><div className="recommendation-body"><h3>Peak consumption periods</h3><p>Compare high-use intervals with production schedules before deciding whether the pattern is unusual.</p></div></div>
        <div className="recommendation-item"><div className="recommendation-icon green"><Leaf size={18} /></div><div className="recommendation-body"><h3>Baseline comparisons</h3><p>Use comparable shifts and production volumes when assessing changes in energy efficiency.</p></div></div>
      </section>
    </>
  );
}
function MachinesPage({ period, setPeriod, apiMachines , onAddMachine}) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [machineId, setMachineId] = useState("");
  const [machineName, setMachineName] = useState("");
  const [energyConsumption, setEnergyConsumption] = useState("");
  const [machineStatus, setMachineStatus] = useState("Running");
  const [isSavingMachine, setIsSavingMachine] = useState(false);
const [machineFormError, setMachineFormError] = useState("");

  const machines = apiMachines.length ? apiMachines : sampleMachines;
  const normalCount = machines.filter((machine) => ["running", "normal"].includes(String(machine.status).toLowerCase())).length;
  const attentionCount = machines.length - normalCount;
  const combinedUsage = machines.reduce((sum, machine) => sum + Number(machine.energyConsumption ?? machine.usage ?? 0), 0);
  return (
    <>

<div className="machines-page-heading">
  <div className="machines-page-title">
    <PageHeading
      title="Machines"
      description="Monitor equipment-level energy use and operating status."
      period={period}
      setPeriod={setPeriod}
    />
  </div>

  <button
    type="button"
    className="add-machine-button"
    onClick={() => setIsAddModalOpen(true)}
  >
    <span aria-hidden="true">+</span> Add Machine
  </button>
</div>
      <section className="metrics-grid">
        <MetricCard title="Machines monitored" value={String(machines.length).padStart(2, "0")} note={apiMachines.length ? "Loaded from MongoDB" : "Fallback sample list"} icon={Factory} />
        <MetricCard title="Normal status" value={String(normalCount).padStart(2, "0")} note="Running or normal status" icon={CircleCheck} />
        <MetricCard title="Needs attention" value={String(attentionCount).padStart(2, "0")} note="Review machine status" icon={Gauge} tone="amber" />
        <MetricCard title="Combined energy use" value={combinedUsage.toLocaleString("en-IN", { maximumFractionDigits: 1 })} unit="kWh" note="Sum of listed machine values" icon={Zap} tone="blue" />
      </section>
      <MachinesTable
        machines={machines}
        sourceLabel={apiMachines.length ? "MongoDB-backed API" : "Fallback sample data"}
        onViewAll={() => {}}
      />
      <section className="panel">
        <div className="panel-heading"><div><h2>Operational checks</h2><p>Review these alongside production requirements</p></div></div>
        <div className="recommendation-item"><div className="recommendation-icon amber"><Wrench size={18} /></div><div className="recommendation-body"><h3>Injection Moulding 02</h3><p>Sample status: attention. Review energy readings, machine settings and recent production conditions with the responsible operator.</p></div><span className="machine-status attention"><span />Attention</span></div>
        <div className="recommendation-item"><div className="recommendation-icon green"><Clock size={18} /></div><div className="recommendation-body"><h3>Air Compressor 01</h3><p>Review idle time during scheduled production breaks. Do not change operating settings without confirming process requirements.</p></div></div>
      </section>

      {isAddModalOpen && (
        <div
          className="machine-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsAddModalOpen(false);
            }
          }}
        >
          <section
            className="machine-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-machine-title"
          >
            <div className="machine-modal-header">
              <div>
                <span className="machine-modal-eyebrow">
                  EQUIPMENT MANAGEMENT
                </span>
                <h2 id="add-machine-title">Add a new machine</h2>
                <p>
                  Register equipment and its current energy consumption.
                </p>
              </div>

              <button
                type="button"
                className="machine-modal-close"
                aria-label="Close form"
                onClick={() => setIsAddModalOpen(false)}
              >
                Ã—
              </button>
            </div>

            <form
              className="machine-form"
              onSubmit={async (event) => {
  event.preventDefault();

  setIsSavingMachine(true);
  setMachineFormError("");

  try {
    await onAddMachine({
      machineId: machineId.trim(),
      name: machineName.trim(),
      status: machineStatus,
      energyConsumption: Number(energyConsumption),
    });

    setMachineId("");
    setMachineName("");
    setEnergyConsumption("");
    setMachineStatus("Running");
    setIsAddModalOpen(false);
  } catch (error) {
    setMachineFormError(
      error.message || "Could not save the machine."
    );
  } finally {
    setIsSavingMachine(false);
  }
}}
            >
              <label className="machine-form-field">
                Machine ID <span>*</span>
                <input
                  type="text"
                  value={machineId}
                  onChange={(event) => setMachineId(event.target.value)}
                  placeholder="e.g. M004"
                  required
                />
              </label>

              <label className="machine-form-field">
                Machine name <span>*</span>
                <input
                  type="text"
                  value={machineName}
                  onChange={(event) => setMachineName(event.target.value)}
                  placeholder="e.g. Boiler System 01"
                  required
                />
              </label>

              <label className="machine-form-field">
                Energy consumption (kWh) <span>*</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={energyConsumption}
                  onChange={(event) =>
                    setEnergyConsumption(event.target.value)
                  }
                  placeholder="Enter consumption"
                  required
                />
              </label>

              <label className="machine-form-field">
                Operating status
                <select
                  value={machineStatus}
                  onChange={(event) => setMachineStatus(event.target.value)}
                >
                  <option value="Running">Running</option>
                  <option value="Idle">Idle</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Offline">Offline</option>
                </select>
              </label>

                {machineFormError && (
  <p className="machine-form-error" role="alert">
    {machineFormError}
  </p>
)}
              <div className="machine-modal-actions">
                <button
                  type="button"
                  className="machine-cancel-button"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>

               <button
       type="submit"
      className="add-machine-button"
        disabled={isSavingMachine}
>
  {isSavingMachine ? "Saving..." : "Save Machine"}
</button>
              </div>
            </form>
          </section>
        </div>
      )}

    </>
  );
}
function RecommendationsPage({ period, setPeriod, apiRecommendations }) {
  const [reviewed, setReviewed] = useState([]);
  const items = apiRecommendations.length ? apiRecommendations.map((item) => ({
    ...item,
    title: item.title,
    category: item.category ?? "EFFICIENCY OPPORTUNITY",
    description: item.description ?? "Review this opportunity against current operating conditions before making changes.",
    saving: Number(item.estimatedSavings ?? item.saving ?? 0),
    savingUnit: item.unit ?? "estimate",
    icon: Zap,
    tone: "amber",
  })) : [];
  const totalSavings = items.reduce((sum, item) => sum + item.saving, 0);
  return (
    <>
      <PageHeading title="Recommendations" description="Review potential efficiency actions before making operational changes." period={period} setPeriod={setPeriod} />
      <section className="metrics-grid">
        <MetricCard title="Suggested actions" value={String(items.length).padStart(2, "0")} note="Returned by recommendations API" icon={Lightbulb} />
        <MetricCard title="Potential savings" value={`â‚¹${totalSavings.toLocaleString("en-IN")}`} note={items[0]?.savingUnit ?? "No estimate available"} icon={Zap} tone="green" />
        <MetricCard title="Requires review" value={String(Math.max(0, items.length - reviewed.length)).padStart(2, "0")} note="Mark an action reviewed below" icon={Gauge} tone="amber" />
        <MetricCard title="Production safeguards" value="On" note="Verify impact before implementation" icon={Factory} tone="blue" />
      </section>
      <section className="panel recommendation-panel">
        <div className="panel-heading"><div><h2>Efficiency opportunities</h2><p>API suggestions; validate against real operating data.</p></div></div>
        {items.map((item, index) => {
          const Icon = item.icon;
          const isReviewed = reviewed.includes(index);
          return (
            <div className="recommendation-item" key={item.title}>
              <div className={`recommendation-icon ${item.tone}`}><Icon size={18} /></div>
              <div className="recommendation-body">
                <span className={`priority ${item.tone === "green" ? "green-text" : ""}`}>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="potential-saving">Potential savings: <strong>â‚¹{item.saving.toLocaleString("en-IN")}/{item.savingUnit.replace(/^INR\//i, "")}</strong></div>
                <button className="text-button" onClick={() => setReviewed((prev) => isReviewed ? prev.filter((n) => n !== index) : [...prev, index])}>
                  {isReviewed ? "Mark as needing review" : "Mark as reviewed"} <ArrowUpRight size={15} />
                </button>
              </div>
              {isReviewed && <span className="machine-status normal"><span />Reviewed</span>}
            </div>
          );
        })}
        {items.length === 0 && <p className="estimate-note">No recommendations were returned by the API.</p>}
        <p className="estimate-note">Estimates are illustrative until validated against measured energy use, tariffs and production conditions.</p>
      </section>
    </>
  );
}
function App() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [period, setPeriod] = useState("Today");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [overview, setOverview] = useState(null);
  const [mlAnalysis, setMlAnalysis] = useState(null);
const [mlError, setMlError] = useState("");
  const [apiMachines, setApiMachines] = useState([]);
  const [apiRecommendations, setApiRecommendations] = useState([]);
  const [apiAlerts, setApiAlerts] = useState([]);
  const [apiError, setApiError] = useState("");

  const handleAddMachine = async (machineData) => {
    const response = await fetch("http://localhost:5000/api/machines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(machineData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Could not save the machine.");
    }

    const machinesResponse = await fetch("http://localhost:5000/api/machines");

    if (!machinesResponse.ok) {
      throw new Error(
        "Machine saved, but the machine list could not be refreshed."
      );
    }

    const updatedMachines = await machinesResponse.json();
    setApiMachines(updatedMachines);

    return result;
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [overviewRes, machinesRes, recommendationsRes, alertsRes] =
          await Promise.all([
            fetch("http://localhost:5000/api/dashboard/overview"),
            fetch("http://localhost:5000/api/machines"),
            fetch("http://localhost:5000/api/recommendations"),
            fetch("http://localhost:5000/api/alerts"),
          ]);
        if (
          !overviewRes.ok ||
          !machinesRes.ok ||
          !recommendationsRes.ok ||
          !alertsRes.ok
        ) {
          throw new Error("Could not load dashboard data.");
        }
        const [overviewData, machinesData, recommendationsData, alertsData] =
          await Promise.all([
            overviewRes.json(),
            machinesRes.json(),
            recommendationsRes.json(),
            alertsRes.json(),
          ]);
        setOverview(overviewData);
        setApiMachines(machinesData);
        setApiRecommendations(recommendationsData);
        setApiAlerts(alertsData);
        setApiError("");
      } catch (error) {
        setApiError("Could not connect to the backend. Please check that it is running.");
        console.error("Dashboard API error:", error);
      }
    }
    loadDashboardData();
    fetch("http://localhost:5000/api/ml/demo-analysis")
  .then((response) => {
    if (!response.ok) throw new Error("ML analysis unavailable");
    return response.json();
  })
  .then((data) => {
    setMlAnalysis(data);
    setMlError("");
  })
  .catch((error) => {
    console.error("ML analysis error:", error);
    setMlError("ML analysis is currently unavailable.");
  });
  }, []);
  const pageDescriptions = {
    Overview: "Workspace overview",
    "Energy analytics": "Energy performance",
    Machines: "Equipment monitoring",
    Recommendations: "Efficiency opportunities",
  };
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <button className="brand" onClick={() => setActiveNav("Overview")}>
          <span className="brand-mark"><Zap size={21} fill="currentColor" /></span>
          <span>Energise<span className="brand-period">.</span></span>
        </button>
        <div className="workspace-label">WORKSPACE</div>
        <div className="factory-switcher">
          <span className="factory-icon"><Factory size={19} /></span>
          <span className="factory-name"><strong>Demo Factory</strong><small>Manufacturing unit</small></span>
          <ChevronDown size={16} />
        </div>
        <div className="nav-label">MENU</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${activeNav === label ? "active" : ""}`} aria-current={activeNav === label ? "page" : undefined} onClick={() => { setActiveNav(label); setMobileMenuOpen(false); }}>
              <Icon size={19} strokeWidth={1.8} /><span>{label}</span>
              {label === "Recommendations" && <span className="nav-count">{apiRecommendations.length || 0}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip"><span className="tip-icon"><Leaf size={18} /></span><strong>Every unit counts.</strong><p>Small efficiency improvements can make a meaningful difference.</p></div>
          <button className="nav-item utility-item" onClick={() => window.alert("Settings will be available when user accounts are implemented.")}><Settings size={19} /><span>Settings</span></button>
          <button className="nav-item utility-item" onClick={() => window.alert("Help and support will be available in a later phase.")}><CircleHelp size={19} /><span>Help &amp; support</span></button>
          <div className="profile"><div className="avatar">DF</div><div className="profile-info"><strong>Demo Factory</strong><small>Factory manager</small></div><ChevronDown size={16} /></div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu-button" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Toggle navigation"><Menu size={22} /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{activeNav}</strong></div>
          <div className="topbar-right"><span className="system-status"><span className="status-dot" /> {apiError ? "API unavailable" : overview ? "API connected Â· sample metrics" : "Connecting to APIâ€¦"}</span><button className="icon-button" aria-label="Notifications" onClick={() => window.alert(apiAlerts.length ? apiAlerts.map((alert) => `${String(alert.severity ?? "info").toUpperCase()}: ${alert.machine ?? "Factory"} â€” ${alert.message}`).join("\n\n") : "No alerts returned by the API.")}><Bell size={19} /><span className="notification-dot" /></button><div className="top-avatar">DF</div></div>
        </header>
        <div className="dashboard-container">
          {apiError && <div role="alert" className="api-error-banner" style={{ padding: "12px 16px", marginBottom: 16, borderRadius: 10, background: "#fff4e5", color: "#8a4b08", border: "1px solid #f2d3a6" }}>{apiError} Dashboard fallback values may be shown.</div>}
          {activeNav === "Overview" && <OverviewPage
  period={period}
  setPeriod={setPeriod}
  setActiveNav={setActiveNav}
  apiMachines={apiMachines}
  overview={overview}
  apiRecommendations={apiRecommendations}
  apiAlerts={apiAlerts}
  mlAnalysis={mlAnalysis}
mlError={mlError}
  apiError={apiError}
/>}
          {activeNav === "Energy analytics" && <AnalyticsPage period={period} setPeriod={setPeriod} />}
          {activeNav === "Machines" && <MachinesPage
  period={period}
  setPeriod={setPeriod}
  apiMachines={apiMachines}
    onAddMachine={handleAddMachine}
/>}
          {activeNav === "Recommendations" && <RecommendationsPage period={period} setPeriod={setPeriod} apiRecommendations={apiRecommendations} />}
          <footer className="dashboard-footer"><span>Â© 2026 Energise Â· Industrial energy intelligence</span><span>{pageDescriptions[activeNav]} Â· {apiError ? "Backend unavailable" : "API connected; sample metrics where labelled"}</span></footer>
        </div>
      </main>
    </div>
  );
}
export default App;
