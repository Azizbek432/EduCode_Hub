import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Parollar bir-biriga mos kelmadi!");
      return;
    }

    setIsLoading(true);

    try {
      // Username yaratish (Masalan: azizbekabdullayev)
      const generatedUsername = formData.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: generatedUsername,
          },
        },
      });

      if (signUpError) {
        console.error("Supabase SignUp Error Details:", signUpError);
        throw new Error(signUpError.message);
      }

      if (data?.user) {
        // Profiles jadvaliga ism, username va boshlang'ich XP ni yozish
        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            full_name: formData.fullName,
            username: generatedUsername,
            xp_points: 0,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

        if (profileError) {
          console.error("Supabase Profile Insert Error Details:", profileError);
        }
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Register Error Catch:", err);
      const errMsg = err.message || "";
      if (errMsg.toLowerCase().includes("user already registered")) {
        setError("Bu email orqali allaqachon ro'yxatdan o'tilgan!");
      } else {
        setError(errMsg || "Ro'yxatdan o'tishda xatolik yuz berdi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">{"</>"}</span>
          <h2>Ro'yxatdan o'tish</h2>
          <p>EduCode Hub ga xush kelibsiz!</p>
        </div>

        {error && <div className="auth-alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>To'liq ismingiz</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Azizbek Abdullayev"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Parol</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label>Parolni tasdiqlang</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? "Bajarilmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className="auth-switch">
          Hisobingiz bormi? <Link to="/login">Kirish</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;