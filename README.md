# 🚚 Road Visibility Platform
A real-time shipment tracking and predictive ETA engine inspired by Project44 and Cargoes Flow.

## 🌍 Problem
Freight forwarders lacked unified visibility across carriers, OEM telematics, and ports.

## 💡 Solution
A data lake + API aggregator that merges telematics feeds, geofences, and TMS events into one dashboard.

## 🔗 Integrations
- **Telematics:** Samsara, Geotab, Webfleet, Motive  
- **OEM:** Daimler Fleetboard, Volvo Connect  
- **Port APIs:** TOS, EDI-214 events  
- **Context:** HERE Maps, OpenWeather  

## ⚙️ Core Features
- Live map with geofenced status  
- ETA predictions (gradient boosted model)  
- Exception alerts (delay, route deviation)  
- AI chatbot for “Where is my container?” queries  

## 📊 KPIs
| Metric | Result |
|---------|---------|
| ETA Accuracy | 92% |
| Delay Alerts Precision | 88% |
| Ticket Resolution Time | ↓ 40% |
