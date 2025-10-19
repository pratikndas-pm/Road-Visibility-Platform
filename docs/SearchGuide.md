# 🔎 RoadIQ Search Guide

## Syntax
- `key:value` — case-insensitive
- Ranges: `key:min..max`, comparisons: `key>=n`, `key<=n`
- Time shorthands (for `updated`, `idle`, `delay`): `15m`, `2h`, `1d`
- Quotes for multi-word values: `origin:"Abu Dhabi"`
- Space-separated tokens = AND; use multiple terms to narrow results.

## Keys
**Entity:** `shipment`, `container`, `booking`, `reference`, `vehicle`, `driver`, `license`, `carrier`, `customer`  
**Status:** `status` (`IN_TRANSIT|IDLE|DELAYED|OFFLINE`), `alert`, `severity` (`LOW|MEDIUM|HIGH`), `priority`  
**Time & ETA:** `eta`, `updated`, `delay`  
**Geo & Routes:** `origin`, `dest`, `lane`, `geofence`, `deviation`  
**Telemetry:** `speed`, `idle`, `heading`  
**Integration:** `source` (Samsara, Geotab, Webfleet, Motive, Volvo, Daimler), `port`, `terminal`  
**Tags:** `tag` (e.g., `temp:2-8C`, `hazmat:limited`, `fragile`, `lane:AE-SA`)

## Examples
- `carrier:DHL status:IN_TRANSIT lane:AE-SA updated<=5m`
- `driver:Ahmed speed>60 eta<=16:00 delay>=15`
- `status:DELAYED deviation>10 origin:"Abu Dhabi" dest:Muscat`
- `tag:temp:2-8C idle>10`
- `source:Volvo port:"Jebel Ali" alert:ROUTE_DEVIATION severity:HIGH`

