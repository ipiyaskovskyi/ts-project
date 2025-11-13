import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterForm } from '../../components/Auth/RegisterForm';
import { register as apiRegister } from '../../api/auth';
import { useState } from 'react';

export const RegisterPage: React.FC = () => {
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (
        email: string,
        password: string,
        firstname: string,
        lastname: string
    ) => {
        setError('');
        setIsLoading(true);
        try {
            const userData = await apiRegister({
                email,
                password,
                firstname,
                lastname,
            });
            setUser(userData);
            navigate('/');
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Registration failed';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <RegisterForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
        />
    );
};
