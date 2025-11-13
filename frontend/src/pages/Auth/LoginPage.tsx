import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LoginForm } from "../../components/Auth/LoginForm";
import { login as apiLogin } from "../../api/auth";
import { useState } from "react";

export const LoginPage: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string) => {
    setError("");
    setIsLoading(true);
    try {
      const userData = await apiLogin({ email, password });
      setUser(userData);
      navigate("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
  );
};
