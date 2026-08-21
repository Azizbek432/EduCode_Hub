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
            .maybeSingle();

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
  const completedLessons = profile?.completed_lessons_count || 0;

  const xpPerLevel = 300;
  const currentLevelNumber = Math.floor(userXP / xpPerLevel) + 1;
  const currentLevelXP = userXP % xpPerLevel; 
  const progressPercentage = Math.min(Math.round((currentLevelXP / xpPerLevel) * 100), 100);

  const getRankTitle = (lvl) => {
    if (lvl >= 12) return "Master 💎";
    if (lvl >= 7) return "Senior 🥇";
    if (lvl >= 3) return "Middle 🥈";
    return "Junior 🥉";
  };

  const rankTitle = getRankTitle(currentLevelNumber);
  const displayName = fullName || "Dasturchi";

  const recommendedCourses = [
    {
      id: "python",
      title: "Python Dasturlash",
      description: "AI va Backend olamiga eng yaxshi kirish tili.",
      badge: "Boshlang'ich",
      badgeClass: "tag-beginner",
      link: "/courses/python"
    },
    {
      id: "typescript",
      title: "TypeScript Master",
      description: "JS loyihalaringizni xatosiz va professional yozing.",
      badge: "O'rta",
      badgeClass: "tag-middle",
      link: "/courses/typescript"
    },
    {
      id: "sql",
      title: "SQL Ma'lumotlar Bazasi",
      description: "Ma'lumotlar bilan ishlashni professional darajada o'rganing.",
      badge: "Professional",
      badgeClass: "tag-professional",
      link: "/courses/sql"
    },
    {
      id: "golang",
      title: "Go (Golang) tili",
      description: "Google yaratgan eng tezkor backend tili bilan tanishing.",
      badge: "Yuqori tezlik",
      badgeClass: "tag-speed",
      link: "/courses/golang"
    }
  ];

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
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={displayName} className="avatar-img" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </Link>
            </div>
          </header>

          <section className="stats-container">
            <div className="info-card">
              <div className="icon-wrapper icon-green">
                <FiCheckCircle size={22} />
              </div>
              <div className="info-data">
                <span className="info-value">{completedLessons}</span>
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
              <div className="info-data" style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="info-value">Lvl {currentLevelNumber}</span>
                  <span className="rank-badge-inline">{rankTitle}</span>
                </div>
                <div className="level-progress-bar">
                  <div className="level-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <span className="info-label">{currentLevelXP}/{xpPerLevel} XP keyingi darajagacha</span>
              </div>
            </div>
          </section>

          <section className="course-section">
            <h2 className="section-title">Siz uchun tavsiyalar</h2>
            <div className="dashboard-courses-grid">
              {recommendedCourses.map((course) => (
                <div key={course.id} className="custom-course-card">
                  <div>
                    <span className={`tag-badge ${course.badgeClass}`}>{course.badge}</span>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                  </div>
                  <Link to={course.link} className="btn-start-now">
                    Boshlash
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;