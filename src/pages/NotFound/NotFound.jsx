import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-code">404</h1>
        <h2>Sahifa topilmadi!</h2>
        <p>Aftidan, siz mavjud bo'lmagan yoki ko'chirilgan sahifaga kirishga urinmoqdasiz.</p>
        <Link to="/dashboard" className="btn-home">
          🏠 Dashboardga qaytish
        </Link>
      </div>
    </div>
  );
}

export default NotFound;