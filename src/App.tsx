
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginForwarder from './pages/LoginForwarder';
import RoadIQ from './frontend/RoadIQ';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginForwarder />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<RoadIQ />} />
      </Route>
    </Routes>
  );
}
