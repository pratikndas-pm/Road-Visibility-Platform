# 🧭 Product Requirements Document (PRD) — RoadIQ

## 1) Overview
RoadIQ is an AI-powered road visibility platform providing **real-time tracking**, **predictive ETA**, and **exception management** for freight forwarders, 3PLs, and port operators.

## 2) Objectives & KPIs
| Goal | KPI | Target |
|---|---|---|
| ETA reliability | MAE | ≤ 10 min |
| Alert quality | Delay Precision | ≥ 88 % |
| Support automation | Ticket Reduction | ↓ 40 % |
| Reliability | Uptime | 99.9 % |
| Adoption | Monthly Active Shippers | +25 % MoM |

## 3) Problem
Data fragmentation across telematics, OEMs, and ports results in poor, reactive operations. RoadIQ creates a unified predictive control tower.

## 4) Solution
- Data lake + ML engine merging telematics, OEM, EDI-214, traffic & weather
- ETA predictions with confidence, drift monitoring, weekly retraining
- Exception engine (delay, deviation, idle, offline) + multi-channel alerts
- RAG chatbot for shipment queries
- KPI dashboards and open APIs

## 5) Architecture Summary
| Layer | Function | Tech |
|---|---|---|
| Ingestion | Normalize feeds | FastAPI, Kafka Connect |
| Data Lake | Store events | Snowflake |
| ML | ETA & anomalies | Databricks, MLflow, XGBoost |
| API | Data serving | FastAPI, GraphQL, WebSocket |
| Frontend | Dashboards | React, Tailwind, Mapbox |
| Analytics | BI & KPIs | Power BI, Grafana |

## 6) Core Features & Requirements
- Map updates ≤ 15s; GPS accuracy ≤ 100m
- Geofence enter/exit events; route breadcrumbs (24h)
- Delay alert when ETA deviation > 30m; deviation > 10 km
- Chatbot: location, ETA, cause-of-delay; response < 2s
- KPI dashboard: on-time %, delay %, ETA MAE; export CSV/PDF

## 7) AI/ML
- Model: Gradient-Boosted Regression (XGBoost)
- Features: distance, speed, weather, traffic, time-of-day, port wait
- Metrics: MAE ≤ 10m, R² ≥ 0.9, Precision ≥ 0.88, Drift ≤ 5 %
- Retraining: weekly or on drift > 5 %
- Latency: ≤ 1s per prediction

## 8) Testing & Validation
| Type | Target |
|---|---|
| Functional | 100 % pass |
| Integration | OEM + EDI stable |
| Model | MAE ≤ 10m |
| Performance | 1k+ shipments @ 60 FPS |
| Security | OAuth2, RBAC, JWT |
| UAT | ≥ 90 % sat |

## 9) Roadmap
- Q4’25: MVP (ETA, Alerts, Tracking)
- Q1’26: Chatbot & Insights
- Q2’26: Partner APIs + Billing
- Q3’26: Predictive Risk & Congestion

## 10) Risks
Data latency from third parties; mitigation with caching, retries, anomaly flags.
