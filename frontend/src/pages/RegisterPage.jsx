import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(email, password);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Rejestracja nie powiodła się");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-xl" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold text-slate-900">Utwórz konto</h1>
        <p className="mt-2 text-sm text-slate-500">Zacznij planować swoją kolejną podróż</p>

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
          {loading ? "Tworzenie konta..." : "Zarejestruj się"}
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Masz już konto? <Link className="font-semibold text-brand-700" to="/login">Zaloguj się</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
