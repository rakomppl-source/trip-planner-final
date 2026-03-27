import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveAuth } = useAuth();

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, user } = await loginUser(email, password);
      saveAuth(token, user);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Logowanie nie powiodło się");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-xl" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold text-slate-900">Zaloguj się</h1>
        <p className="mt-2 text-sm text-slate-500">Uzyskaj dostęp do swojego planera podróży</p>

        <label className="mt-6 block text-sm font-medium text-slate-700">E-mail</label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 p-3"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">Hasło</label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 p-3"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-brand-600 p-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? "Logowanie..." : "Zaloguj się"}
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Nie masz konta? <Link className="font-semibold text-brand-700" to="/register">Zarejestruj się</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
