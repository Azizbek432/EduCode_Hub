import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { FiSun, FiMoon, FiLogOut, FiUser } from "react-icons/fi";
import "./Navbar.css";

function Navbar({ darkMode, toggleDark }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getInitialSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Foydalanuvchi";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">{"</>"}</span>
          <span className="logo-text">
            EduCode<span className="logo-accent">Hub</span>
          </span>
        </Link>

        <ul className="navbar-links">
          <li>
            <Link to="/courses">Kurslar</Link>
          </li>
          <li>
            <Link to="/editor">Editor</Link>
          </li>
          <li>
            <Link to="/leaderboard">Leaderboard</Link>
          </li>
          {user && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
        </ul>

        <div className="navbar-right">
          <button className="theme-toggle" onClick={toggleDark} title="Mavzuni o'zgartirish">
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {user ? (
            <div className="user-menu">
              <Link to="/dashboard" className="user-profile-badge">
                <FiUser size={16} />
                <span className="welcome-msg">{displayName}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout-nav" title="Chiqish">
                <FiLogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                Kirish
              </Link>
              <Link to="/register" className="btn-register">
                Ro'yxatdan o'tish
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;