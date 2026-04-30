import { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  // 1. Dark Mode State - LocalStorage bilan boshlang'ich qiymat
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // 2. User State - LocalStorage bilan
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("edu_user");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          name: "Azizbek_tester",
          xp: 0,
          completedLessons: [],
        };
  });

  // 3. Theme va User ma'lumotlarini sinxronizatsiya qilish
  useEffect(() => {
    // Dark mode klasini HTML elementiga qo'shish
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }

    // Foydalanuvchi ma'lumotlarini saqlash
    localStorage.setItem("edu_user", JSON.stringify(user));
  }, [user, darkMode]); // Faqat user yoki darkMode o'zgarganda ishlaydi

  // 4. XP qo'shish funksiyasi (Callback)
  const handleAddXP = (amount, lessonId) => {
    if (user.completedLessons.includes(lessonId)) {
      alert("Bu darsni allaqachon tugatgansiz!");
      return;
    }

    setUser((prev) => ({
      ...prev,
      xp: prev.xp + amount,
      completedLessons: [...prev.completedLessons, lessonId],
    }));
  };

  // 5. Leaderboard - Hisoblashlarni optimallashtirish
  const leaderboardUsers = useMemo(() => {
    const others = [
      { id: 1, name: "Doston_Dev", points: 1500, level: "Middle" },
      { id: 2, name: "Madina_Code", points: 2800, level: "Senior" },
      { id: 4, name: "Jasur_AI", points: 1200, level: "Middle" },
    ];

    const currentLevel =
      user.xp >= 2000 ? "Senior" : user.xp >= 800 ? "Middle" : "Junior";

    const currentUserData = {
      id: 3,
      name: user.name,
      points: user.xp,
      level: currentLevel,
    };

    return [...others, currentUserData].sort((a, b) => b.points - a.points);
  }, [user.xp, user.name]);

  return (
    <BrowserRouter>
      {/* Navbar'ga setDarkMode emas, toggle funksiyasini beramiz */}
      <Navbar
        darkMode={darkMode}
        toggleDark={() => setDarkMode(!darkMode)}
        user={user}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/courses" element={<Courses user={user} />} />
        <Route
          path="/course/:id"
          element={<CourseDetail user={user} onComplete={handleAddXP} />}
        />
        <Route path="/editor" element={<Editor />} />
        <Route
          path="/leaderboard"
          element={
            <Leaderboard users={leaderboardUsers} currentUser={user.name} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
