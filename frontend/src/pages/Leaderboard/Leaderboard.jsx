import React from "react";
import "./Leaderboard.css";

function Leaderboard({ users, currentUser }) {
  // Foydalanuvchilarni ballari bo'yicha kamayish tartibida saralaymiz
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <div className="leaderboard-wrapper">
      <div className="leaderboard-container">
        <header className="leaderboard-header">
          <h1>Peshqadamlar Jadvali 👑</h1>
          <p>Dasturlash olamining eng kuchli bilimdonlari</p>
        </header>

        <div className="leaderboard-card">
          <div className="leaderboard-table-header">
            <span>O'rin</span>
            <span>Foydalanuvchi</span>
            <span>Daraja</span>
            <span>Jami XP</span>
          </div>

          <div className="leaderboard-list">
            {sortedUsers.map((u, index) => (
              <div
                key={u.id}
                className={`leaderboard-row ${u.name === currentUser ? "active-user-row" : ""}`}
              >
                <div className="rank">
                  {index === 0
                    ? "🥇"
                    : index === 1
                      ? "🥈"
                      : index === 2
                        ? "🥉"
                        : `#${index + 1}`}
                </div>
                <div className="user-profile">
                  <div className="user-avatar-small">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name-text">{u.name}</span>
                </div>
                <div className="user-level-badge">{u.level}</div>
                <div className="user-xp-total">
                  {u.points.toLocaleString()} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
