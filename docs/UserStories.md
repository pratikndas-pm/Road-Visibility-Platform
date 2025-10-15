# 🧩 User Stories & Acceptance Criteria
### Road Visibility Platform — Real-Time Tracking & Predictive ETA Engine

---

## 📘 Table of Contents
1. [Epic 1 — Real-Time Shipment Tracking](#epic-1--real-time-shipment-tracking)  
2. [Epic 2 — Predictive ETA Engine](#epic-2--predictive-eta-engine)  
3. [Epic 3 — Exception Management & Alerts](#epic-3--exception-management--alerts)  
4. [Epic 4 — AI Chatbot Assistant](#epic-4--ai-chatbot-assistant)  
5. [Epic 5 — KPI Dashboard & Analytics](#epic-5--kpi-dashboard--analytics)  
6. [Epic 6 — API & Integrations](#epic-6--api--integrations)  
7. [Epic 7 — Security, Uptime, and Non-Functional Tests](#epic-7--security-uptime-and-non-functional-tests)  
8. [AI Model Testing Guidelines for QA](#ai-model-testing-guidelines-for-qa)  
9. [Functional & Integration Test Matrix](#functional--integration-test-matrix)

---

## 🧭 Epic 1 — Real-Time Shipment Tracking

**Goal:** Provide unified, accurate real-time visibility for all shipments across multiple telematics and OEM data sources.

---

### 🧠 User Stories

**Story 1.1 — Map View with Live Updates**
> As a logistics operator, I want to view all shipments on a live map so I can monitor their real-time location and status.

**Acceptance Criteria**
- [ ] Map auto-refreshes every ≤15 seconds.  
- [ ] Each shipment marker updates position and status (On-Time / Idle / Delayed).  
- [ ] User can filter shipments by carrier, region, or vehicle type.  
- [ ] Tooltip on hover shows shipment ID, driver name, and ETA.  

**Testing Notes**
- Simulate 1000 concurrent shipments → Map remains 60 FPS.  
- Verify GPS accuracy ≤ 100 m deviation.

---

**Story 1.2 — Geofencing**
> As a control tower analyst, I want automatic entry/exit logs when a vehicle crosses defined zones.

**Acceptance Criteria**
- [ ] System triggers an event when vehicle enters or exits a defined polygon.  
- [ ] Entry/Exit timestamps recorded in Snowflake.  
- [ ] Alerts appear on map and are exportable via CSV.  
- [ ] Latency ≤ 5 seconds between geofence event and dashboard update.  

**Testing Notes**
- Validate geofence accuracy ≥ 95%.  
- Test overlapping geofences and ensure correct event tagging.

---

## 🚀 Epic 2 — Predictive ETA Engine

**Goal:** Provide machine-learning-based ETA prediction with continuous accuracy monitoring.

---

### 🧠 User Stories

**Story 2.1 — ETA Prediction**
> As a planner, I want an accurate ETA prediction for every shipment so I can schedule arrivals efficiently.

**Acceptance Criteria**
- [ ] ETA displayed in minutes with ± confidence range.  
- [ ] Model accuracy (MAE) ≤ 10 min on test dataset.  
- [ ] Retraining pipeline triggers automatically when data drift > 5%.  
- [ ] ETA recalculated in real-time when delay events occur.  

**AI Testing Guidelines**
- **Precision@K:** Measure top-K ETA accuracy (K=5).  
- **MAE (Mean Absolute Error):** ≤ 10 minutes.  
- **F1 Score:** ≥ 0.88 for delay classification.  
- **Drift Detection:** QA validates MLflow logs weekly; alert raised if model drift exceeds 5%.  
- **Latency Test:** Model inference response ≤ 1 sec.

---

**Story 2.2 — ETA Confidence Visualization**
> As an operator, I want to see ETA confidence levels on the dashboard to gauge reliability.

**Acceptance Criteria**
- [ ] ETA displayed with color-coded confidence band:  
  - Green = High confidence (>85%)  
  - Yellow = Medium (60–85%)  
  - Red = Low (<60%)  
- [ ] Tooltip shows factors affecting confidence (traffic, distance, weather).  
- [ ] User can toggle between actual ETA vs predicted ETA in table view.  

**Testing Notes**
- Compare predicted vs actual arrival for 50 test shipments.  
- Validate visualization logic and legend mapping.

---

## ⚠️ Epic 3 — Exception Management & Alerts

**Goal:** Detect and communicate deviations, delays, and anomalies automatically.

---

### 🧠 User Stories

**Story 3.1 — Delay Alerts**
> As a dispatcher, I want to be alerted when shipments are delayed beyond threshold.

**Acceptance Criteria**
- [ ] Alert triggered if ETA deviation > 30 min.  
- [ ] Alerts shown in red with timestamp and reason (traffic/weather/idle).  
- [ ] Email and Slack notification triggered simultaneously.  
- [ ] Alert cleared automatically when resolved.  

**Testing Notes**
- Simulate delay data via API mocks → validate alert trigger latency ≤ 30 sec.  
- Verify no false positives (Precision ≥ 88%).

---

**Story 3.2 — Route Deviation**
> As a control tower operator, I want to be notified when a vehicle deviates from planned route by more than 10 km.

**Acceptance Criteria**
- [ ] System compares actual route vs planned route (polyline).  
- [ ] Alert if deviation > 10 km or > 20% of planned path.  
- [ ] Event logged in Snowflake with location, timestamp, driver ID.  

**Testing Notes**
- Validate route matching algorithm accuracy ≥ 90%.  
- Simulate deviation scenarios and verify alert trigger.

---

## 💬 Epic 4 — AI Chatbot Assistant

**Goal:** Enable operators to ask natural-language questions like “Where is my container?” and get instant AI responses.

---

### 🧠 User Stories

**Story 4.1 — Shipment Query Chat**
> As a logistics operator, I want to ask the AI assistant for real-time shipment status.

**Acceptance Criteria**
- [ ] Chatbot understands natural queries (English).  
- [ ] Returns shipment location, ETA, and alert status.  
- [ ] Chat context retained across conversation.  
- [ ] Model retrieval latency < 2 sec per query.  

**AI Testing Guidelines**
- **Intent Recognition Accuracy:** ≥ 90%  
- **Response Latency:** ≤ 2 sec  
- **Context Retention:** Persist across 3-turn dialogue  
- **RAG Validation:** Answers must match database values (exact match ≥ 95%)  
- **Factual Accuracy:** No hallucinations (verified vs telemetry DB)

---

**Story 4.2 — Predictive Insight Queries**
> As a manager, I want the chatbot to summarize which shipments are likely to be delayed today.

**Acceptance Criteria**
- [ ] Query like “Show shipments likely to be late today” returns a ranked list by confidence.  
- [ ] Chatbot uses ETA model output for prediction logic.  
- [ ] Confidence (%) displayed for each prediction.  

**Testing Notes**
- Validate model vs actual outcome match rate ≥ 90%.  
- Check sorting accuracy of delayed shipments list.

---

## 📊 Epic 5 — KPI Dashboard & Analytics

**Goal:** Provide an operational dashboard summarizing performance and AI insights.

---

### 🧠 User Stories

**Story 5.1 — KPI Dashboard**
> As a product manager, I want a dashboard that shows key operational metrics.

**Acceptance Criteria**
- [ ] Dashboard shows On-Time %, Delay %, ETA Accuracy, and Active Alerts.  
- [ ] Filterable by customer, route, or carrier.  
- [ ] Charts update every 15 min.  
- [ ] Export report in CSV and PDF.  

**Testing Notes**
- Cross-verify dashboard values with Snowflake aggregates.  
- Ensure report export within 5 seconds.

---

**Story 5.2 — AI Model Metrics Panel**
> As a data scientist, I want to see model performance metrics (Precision, Recall, MAE).

**Acceptance Criteria**
- [ ] Panel shows real-time model accuracy (Precision, F1, Drift).  
- [ ] Red warning if model drift > 5%.  
- [ ] Data syncs automatically from MLflow logs.  

**Testing Notes**
- Validate metrics display sync (no >15 min lag).  
- Simulate model retraining event → confirm metric update.

---

## 🔗 Epic 6 — API & Integrations

**Goal:** Provide robust APIs for partners, TMS, and telematics integrations.

---

**Story 6.1 — Public Shipment API**
> As a developer, I want to fetch shipment data via REST API.

**Acceptance Criteria**
- [ ] `/api/v1/shipments` returns JSON array with status, ETA, and position.  
- [ ] Pagination and filtering supported.  
- [ ] OAuth2-based authentication required.  

**Testing Notes**
- Validate rate limits (1000 req/min).  
- Ensure error handling returns correct HTTP codes.

---

**Story 6.2 — WebSocket Updates**
> As a third-party system, I want to receive real-time shipment updates via WebSocket.

**Acceptance Criteria**
- [ ] `/ws/updates` emits status changes instantly.  
- [ ] Connection resilient to 30s downtime.  
- [ ] Message format: `{shipment_id, status, timestamp}`  

**Testing Notes**
- Test reconnect logic after simulated network loss.  
- Validate message delivery rate 100%.

---

## 🛡️ Epic 7 — Security, Uptime, and Non-Functional Tests

**Goal:** Ensure enterprise-grade security, scalability, and compliance.

---

### 🧠 User Stories

**Story 7.1 — Authentication**
> As an admin, I want secure OAuth2 and JWT-based login.

**Acceptance Criteria**
- [ ] Users authenticate via OAuth2 provider.  
- [ ] JWT tokens expire in 24h.  
- [ ] RBAC restricts features by role (Viewer, Analyst, Admin).  

**Testing Notes**
- Pen test JWT tokens for replay and expiry.  
- Ensure RBAC permission table correct for all endpoints.

---

**Story 7.2 — Availability**
> As a platform owner, I want the system to maintain 99.9% uptime.

**Acceptance Criteria**
- [ ] Health checks every 30s.  
- [ ] Auto-failover to secondary node.  
- [ ] Real-time uptime dashboard.  

**Testing Notes**
- Chaos testing (Simulate node failure).  
- Validate auto-restart within 15s.

---

## 🤖 AI Model Testing Guidelines for QA

| Test Type | Description | Metric | Target |
|------------|--------------|---------|---------|
| **Precision@K** | Measures accuracy of top-K ETA predictions | ≥ 0.90 | ✅ |
| **MAE (Mean Absolute Error)** | Average ETA deviation in minutes | ≤ 10 | ✅ |
| **F1 Score** | Delay classification accuracy | ≥ 0.88 | ✅ |
| **Drift Detection** | Detects change in input data distribution | Alert > 5% drift | ✅ |
| **Response Latency** | Model inference time | < 1 sec | ✅ |
| **RAG Validation** | Accuracy of chatbot factual responses | ≥ 95% | ✅ |
| **Bias Testing** | Ensure no bias by vehicle type or region | Pass | ✅ |
| **Logging & Traceability** | MLflow experiment tracking | 100% coverage | ✅ |

---

## 🧪 Functional & Integration Test Matrix

| Module | Test Type | Description | Expected Result |
|---------|------------|-------------|------------------|
| **Tracking** | Functional | Map updates every 15s | ✅ |
| **ETA Model** | Regression | ETA MAE ≤ 10 min | ✅ |
| **Alerts** | Functional | Delay > 30 min triggers alert | ✅ |
| **Chatbot** | AI / NLP | 95% correct shipment responses | ✅ |
| **APIs** | Integration | REST + WebSocket stable under load | ✅ |
| **Dashboard** | UX | Refresh rate ≤ 15s | ✅ |
| **Security** | Pen Test | No unauthorized endpoint access | ✅ |
| **Performance** | Load | 1,000 concurrent shipments | ✅ |

---

## 🧩 Linked References
- [PRD.md](./PRD.md) — Product overview, KPIs, and technical design  
- [FrontendGuide.md](./FrontendGuide.md) — UI layout and UX rules  
- [TestingCriteria.md](./TestingCriteria.md) — QA automation standards  

---

<div align="center">
  <sub>© 2025 Road Visibility Platform — User Stories & QA Guidelines by Pratik Nirupam Das | AI Product Management</sub>
</div>
