import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoadIQ from "./frontend/RoadIQ";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default route now opens Dashboard directly */}
        <Route path="/" element={<RoadIQ />} />
        <Route path="/dashboard" element={<RoadIQ />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
