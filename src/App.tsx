import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedLayout from '@/components/ProtectedLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Search from '@/pages/Search';
import Map from '@/pages/Map';
import Marketplace from '@/pages/Marketplace';
import Tools from '@/pages/Tools';
import Profile from '@/pages/Profile';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/map" element={<Map />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/tools" element={<Tools />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
