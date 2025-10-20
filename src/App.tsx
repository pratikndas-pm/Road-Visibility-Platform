
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoadIQ from './frontend/RoadIQ';

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<RoadIQ />} />
      <Route path="/dashboard" element={<RoadIQ />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
