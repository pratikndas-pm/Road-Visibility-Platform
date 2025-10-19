
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

const LoginForwarder: React.FC = () => {
  const { loginWithPassword } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('forwarder@roadiq.demo');
  const [password, setPassword] = useState('RoadIQ@2025');
  const [org, setOrg] = useState('ACME Logistics');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithPassword({ email, password, org });
      nav('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <form onSubmit={submit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">RoadIQ Freight Forwarder Login</h1>
        {error && <p className="text-rose-400 text-sm mb-2">{error}</p>}
        <label className="block mb-1 text-sm">Email</label>
        <input className="w-full p-2 mb-3 bg-slate-800 border border-slate-700 rounded" value={email} onChange={e=>setEmail(e.target.value)} />
        <label className="block mb-1 text-sm">Password</label>
        <input type="password" className="w-full p-2 mb-3 bg-slate-800 border border-slate-700 rounded" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default LoginForwarder;
