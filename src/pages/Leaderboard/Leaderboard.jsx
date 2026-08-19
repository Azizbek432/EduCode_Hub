import React, { useEffect, useState } from 'react'
import { getLeaderboard } from '../../services/courseService'
import './Leaderboard.css'

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard()
        setLeaders(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Leaderboard error:', err)
        setLeaders([])
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>🏆 O'zbekiston Dasturchilari Reytingi</h1>
        <p>EduCode Hub platformasida darslarni tugatib, XP to'plang va peshqadamlar safidan joy oling!</p>
      </div>

      {loading ? (
        <div className="loading-spinner">Reyting yuklanmoqda...</div>
      ) : (
        <div className="leaderboard-table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Dasturchi</th>
                <th>XP Ballari</th>
              </tr>
            </thead>
            <tbody>
              {leaders && leaders.length > 0 ? (
                leaders.map((user, index) => (
                  <tr key={user?.id || index} className={index < 3 ? `top-${index + 1}` : ''}>
                    <td className="rank-cell">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && index + 1}
                    </td>
                    <td className="user-cell">
                      <img 
                        src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id || index}`} 
                        alt="avatar" 
                        className="user-avatar"
                      />
                      <span className="user-name">{user?.full_name || 'Noma\'lum Dasturchi'}</span>
                    </td>
                    <td className="xp-cell">{user?.xp_points || 0} XP</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                    Hozircha peshqadamlar yo'q. Birinchi bo'lib XP to'plang!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}