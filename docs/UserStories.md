# 🧩 User Stories & QA — RoadIQ

## Epic 1 — Real-Time Tracking
**Story:** As an operator, I see live positions with status.  
**Acceptance:** refresh ≤ 15s, GPS accuracy ≤ 100m, idle flagged > 10m, offline > 5m.

## Epic 2 — Predictive ETA
**Story:** As a planner, I view ETA + confidence.  
**Acceptance:** MAE ≤ 10m; confidence band colors; retrain weekly or drift > 5%.
**AI QA:** Precision@K ≥ 0.9, F1 ≥ 0.88, latency ≤ 1s, calibration via Brier ≤ 0.2.

## Epic 3 — Exception Management
**Story:** As a dispatcher, I receive alerts for delay/deviation/idle.  
**Acceptance:** trigger on delay > 30m or deviation > 10km within 30s; multi-channel notifications.

## Epic 4 — AI Chatbot
**Story:** As a user, I ask “Where is SHP-74219?” and get a verified answer.  
**Acceptance:** response < 2s; exact-match vs DB ≥ 95%; 3-turn context retention.

## Epic 5 — KPI Dashboard
**Story:** As a PM, I monitor on-time %, ETA accuracy, idle %, alert precision, uptime.  
**Acceptance:** charts update every 15m; CSV/PDF export in < 5s.

## Epic 6 — APIs & Integrations
**Story:** As a developer, I fetch `/api/v1/shipments` and subscribe to `/ws/updates`.  
**Acceptance:** OAuth2, 1k req/min, graceful error codes, reconnection ≤ 5s.

## AI Testing Guidelines (for QA)
- **MAE:** ≤ 10m on rolling 7-day
- **Precision/Recall:** ≥ 0.88 / ≥ 0.85 for delay classification
- **Drift:** alert > 5% feature shift
- **Latency:** inference ≤ 1s
- **RAG Accuracy:** ≥ 95% exact match vs telemetry DB
