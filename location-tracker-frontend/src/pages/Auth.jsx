import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <AuthLayout>
            {isLogin ? (
                <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
                <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
        </AuthLayout>
    );
};