import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { FiSun, FiMoon, FiLogOut, FiUser } from "react-icons/fi";
import "./Navbar.css";

function Navbar({ darkMode, toggleDark }) {
  const [user, setUser] = useState(null);
  const [profileName, setProfileName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData(currentUser) {
      if (!currentUser) {
        setProfileName("");
        return;
      }

      const metaName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", currentUser.id)
          .single();

        if (!error && data?.full_name) {
          setProfileName(data.full_name);
        } else if (metaName) {
          setProfileName(metaName);
        } else {
          setProfileName(currentUser.email?.split("@")[0] || "Foydalanuvchi");
        }
      } catch (err) {
        console.error("Profile yuklashda xatolik:", err);
        setProfileName(metaName || currentUser.email?.split("@")[0] || "Foydalanuvchi");
      }
    }

    async function getInitialSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserData(session.user);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setProfileName("");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileName("");
    navigate("/login");
  };

  const displayName = profileName || "Foydalanuvchi";

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