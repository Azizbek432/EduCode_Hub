import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import LessonView from "./pages/LessonView/LessonView";
import Navbar from "./components/Navbar/Navbar";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Courses from "./pages/Courses/Courses";
import CourseDetail from "./pages/CourseDetail/CourseDetail";
import Editor from "./pages/Editor/Editor";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.error("Profile yuklashda xatolik:", err);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar
        darkMode={darkMode}
        toggleDark={() => setDarkMode(!darkMode)}
        session={session}
        profile={profile}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/register" 
          element={session ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        <Route 
          path="/login" 
          element={session ? <Navigate to="/dashboard" replace /> : <Login />} 
        />

        <Route 
          path="/dashboard" 
          element={session ? <Dashboard session={session} profile={profile} /> : <Navigate to="/login" replace />} 
        />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetail session={session} profile={profile} />} />
        <Route path="/lesson/:id" element={<LessonView session={session} profile={profile} />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;