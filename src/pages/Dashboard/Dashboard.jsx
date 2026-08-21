import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiBookOpen, 
  FiCode, 
  FiAward, 
  FiCheckCircle, 
  FiZap, 
  FiTrendingUp, 
  FiLogOut,
  FiSettings 
} from "react-icons/fi";
import { supabase } from "../../lib/supabaseClient";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfileData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setUserEmail(user.email || "");
          const metaName = user.user_metadata?.full_name || user.user_metadata?.name;

          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (!error && data) {
            setProfile(data);
            setFullName(data.full_name || metaName || user.email?.split("@")[0]);
          } else {
            setFullName(metaName || user.email?.split("@")[0]);
          }
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Profile yuklashda xatolik:", err);
      } finally {
        setLoading(false);
      }
    }

    getProfileData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const userXP = profile?.xp_points || 0;
  const currentLevel =
    userXP >= 2000 ? "Senior" : userXP >= 800 ? "Middle" : "Junior";
  const displayName = fullName || "Dasturchi";

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-menu">
            <Link to="/dashboard" className="menu-item active">
              <FiHome className="menu-icon" /> <span>Boshqaruv</span>
            </Link>
            <Link to="/courses" className="menu-item">
              <FiBookOpen className="menu-icon" /> <span>Kurslar</span>
            </Link>
            <Link to="/editor" className="menu-item">
              <FiCode className="menu-icon" /> <span>Editor</span>
            </Link>
            <Link to="/leaderboard" className="menu-item">
              <FiAward className="menu-icon" /> <span>Reyting</span>
            </Link>
            <Link to="/settings" className="menu-item">
              <FiSettings className="menu-icon" /> <span>Sozlamalar</span>
            </Link>
          </nav>

          <div className="sidebar-footer">
            <div className="user-brief-info">
              <span className="user-name-text">{loading ? "Yuklanmoqda..." : displayName}</span>
              <span className="user-email-text">{userEmail}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout-sidebar">
              <FiLogOut size={16} /> Chiqish
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <header className="top-banner">
            <div className="welcome-text">
              <h1>Salom, {loading ? "..." : displayName}! 👋</h1>
              <p>Bugun qaysi texnologiyani zabt etamiz?</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <Link 
                to="/settings" 
                className="user-avatar-circle" 
                title="Sozlamalarga o'tish"
                style={{ textDecoration: "none" }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Link>
            </div>
          </header>

          <section className="stats-container">
            <div className="info-card">
              <div className="icon-wrapper icon-green">
                <FiCheckCircle size={22} />
              </div>
              <div className="info-data">
                <span className="info-value">0</span>
                <span className="info-label">Tugatilgan darslar</span>
              </div>
            </div>

            <div className="info-card">
              <div className="icon-wrapper icon-amber">
                <FiZap size={22} />
              </div>
              <div className="info-data">
                <span className="info-value">{userXP} XP</span>
                <span className="info-label">Jami Natija</span>
              </div>
            </div>

            <div className="info-card">
              <div className="icon-wrapper icon-purple">
                <FiTrendingUp size={22} />
              </div>
              <div className="info-data">
                <span className="info-value">{currentLevel}</span>
                <span className="info-label">Bosqich Darajasi</span>
              </div>
            </div>
          </section>

          <section className="course-section">
            <h2 className="section-title">Siz uchun tavsiyalar</h2>
            <div className="dashboard-courses-grid">
              <div className="custom-course-card">
                <span className="tag-badge tag-beginner">Boshlang'ich</span>
                <h3>Python Dasturlash</h3>
                <p>AI va Backend olamiga eng yaxshi kirish tili.</p>
                <Link to="/courses" className="btn-start-now">
                  Boshlash
                </Link>
              </div>

              <div className="custom-course-card">
                <span className="tag-badge tag-middle">O'rta</span>
                <h3>TypeScript Master</h3>
                <p>JS loyihalaringizni xatosiz va professional yozing.</p>
                <Link to="/courses" className="btn-start-now">
                  Boshlash
                </Link>
              </div>

              <div className="custom-course-card">
                <span className="tag-badge tag-professional">Professional</span>
                <h3>SQL Ma'lumotlar Bazasi</h3>
                <p>Ma'lumotlar bilan ishlashni professional darajada o'rganing.</p>
                <Link to="/courses" className="btn-start-now">
                  Boshlash
                </Link>
              </div>

              <div className="custom-course-card">
                <span className="tag-badge tag-speed">Yuqori tezlik</span>
                <h3>Go (Golang) tili</h3>
                <p>Google yaratgan eng tezkor backend tili bilan tanishing.</p>
                <Link to="/courses" className="btn-start-now">
                  Boshlash
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;