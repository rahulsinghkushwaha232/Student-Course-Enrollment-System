import { useState } from "react";

import GlobalSearch from "./GlobalSearch";

import "../styles/DashboardTop.css";

function DashboardTop() {

  const [notifications] = useState(3);

  const today = new Date();

  const date = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = today.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="dashboard-top">

      {/* =========================
          LEFT
      ========================== */}

      <div className="top-left">

        <div className="page-title">

          <h2>
            Dashboard
          </h2>

          <p>
            Student Course Enrollment System
          </p>

        </div>

      </div>


      {/* =========================
          SEARCH
      ========================== */}

      <div className="top-search">

        <GlobalSearch />

      </div>


      {/* =========================
          RIGHT
      ========================== */}

      <div className="top-right">

        {/* Date & Time */}

        <div className="date-time">

          <span className="date">
            📅 {date}
          </span>

          <span className="time">
            🕐 {time}
          </span>

        </div>


        {/* Notification */}

        <button
          className="notification-button"
          title="Notifications"
        >

          🔔

          {notifications > 0 && (
            <span className="notification-badge">
              {notifications}
            </span>
          )}

        </button>


        {/* Profile */}

        <div className="user-profile">

          <div className="profile-avatar">
            👤
          </div>

          <div className="profile-info">

            <strong>
              Rahul
            </strong>

            <span>
              Administrator
            </span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default DashboardTop;