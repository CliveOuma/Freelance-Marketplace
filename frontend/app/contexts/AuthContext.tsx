'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';


interface AuthContextType {
    isLoggedIn: boolean;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');


            if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
                localStorage.removeItem('authToken');
                setIsLoggedIn(false);
            } else {
                setIsLoggedIn(true);
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('authToken', token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
    };

    const clearAuth = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            setIsLoggedIn(false);
        }
    };

    if (typeof window !== 'undefined') {
        (window as any).clearAuth = clearAuth;
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
