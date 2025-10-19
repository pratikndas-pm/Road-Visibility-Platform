
import React, { createContext, useContext, useState, useMemo } from 'react';

export type User = { email: string; role: 'freight_forwarder'; org: string; name?: string };

type AuthContextType = {
  user: User | null;
  loginWithPassword: (params: { email: string; password: string; org: string; remember?: boolean }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = [
  { email: 'forwarder@roadiq.demo', password: 'RoadIQ@2025', org: 'ACME Logistics', name: 'Aisha Khan' },
  { email: 'ops@falconfreight.demo', password: 'Falcon#123', org: 'Falcon Freight', name: 'Omar N.' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('roadiq_user');
    return saved ? JSON.parse(saved) : null;
  });

  const loginWithPassword = async ({ email, password, org, remember }: any) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password && u.org === org);
    if (!found) throw new Error('Invalid credentials');
    const u: User = { email: found.email, role: 'freight_forwarder', org: found.org, name: found.name };
    setUser(u);
    if (remember) localStorage.setItem('roadiq_user', JSON.stringify(u));
  };

  const logout = () => { setUser(null); localStorage.removeItem('roadiq_user'); };

  const value = useMemo(() => ({ user, loginWithPassword, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
