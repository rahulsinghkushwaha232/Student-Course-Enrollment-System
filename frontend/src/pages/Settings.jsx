import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Settings as SettingsIcon,
  Bell,
  RefreshCw,
  Sun,
  Moon,
  User,
  Lock,
  Save,
  RotateCcw,
  CheckCircle,
} from "lucide-react";

import { useTheme } from "../services/useTheme";
import Toast from "../components/Toast";

import "../styles/Settings.css";

function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") !== "false"
  );

  const [autoRefresh, setAutoRefresh] = useState(
    localStorage.getItem("autoRefresh") === "true"
  );

  const [toast, setToast] = useState(null);

  // Show Toast
  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  // Save Settings
  const handleSave = () => {
    localStorage.setItem("notifications", String(notifications));
    localStorage.setItem("autoRefresh", String(autoRefresh));

    showToast("Settings saved successfully!", "success");
  };

  // Reset Settings
  const handleReset = () => {
    setNotifications(true);
    setAutoRefresh(false);
    setTheme("light");

    localStorage.setItem("notifications", "true");
    localStorage.setItem("autoRefresh", "false");
    localStorage.setItem("theme", "light");

    showToast("Settings restored to default!", "info");
  };

  return (
    <div className="settings-page">

      {/* ==================== PAGE HEADER ==================== */}
      <div className="settings-header">
        <div className="settings-title-section">

          <div className="settings-title-icon">
            <SettingsIcon size={26} />
          </div>

          <div>
            <h1>Settings</h1>
            <p>
              Manage your Student Course Enrollment System settings.
            </p>
          </div>

        </div>
      </div>


      {/* ==================== APPEARANCE ==================== */}
      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-card-icon">
            <Sun size={21} />
          </div>

          <div>
            <h2>Appearance</h2>
            <p>Customize how the application looks.</p>
          </div>

        </div>


        <div className="setting-row">

          <div className="setting-info">
            <strong>Theme</strong>

            <span>
              Choose your preferred application theme.
            </span>
          </div>


          <div className="theme-options">

            {/* Light Theme */}
            <button
              type="button"
              className={`theme-option ${
                theme === "light" ? "active" : ""
              }`}
              onClick={() => setTheme("light")}
            >
              <Sun size={18} />
              <span>Light</span>
            </button>


            {/* Dark Theme */}
            <button
              type="button"
              className={`theme-option ${
                theme === "dark" ? "active" : ""
              }`}
              onClick={() => setTheme("dark")}
            >
              <Moon size={18} />
              <span>Dark</span>
            </button>

          </div>

        </div>

      </div>


      {/* ==================== NOTIFICATIONS ==================== */}
      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-card-icon">
            <Bell size={21} />
          </div>

          <div>
            <h2>Notifications</h2>
            <p>
              Control dashboard notification preferences.
            </p>
          </div>

        </div>


        <div className="setting-row">

          <div className="setting-info">

            <strong>
              Dashboard Notifications
            </strong>

            <span>
              Receive notifications about dashboard activities.
            </span>

          </div>


          <label className="settings-switch">

            <input
              type="checkbox"
              checked={notifications}
              onChange={(event) =>
                setNotifications(event.target.checked)
              }
            />

            <span className="settings-slider"></span>

          </label>

        </div>

      </div>


      {/* ==================== DASHBOARD ==================== */}
      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-card-icon">
            <RefreshCw size={21} />
          </div>

          <div>
            <h2>Dashboard</h2>
            <p>
              Manage dashboard data refresh behavior.
            </p>
          </div>

        </div>


        <div className="setting-row">

          <div className="setting-info">

            <strong>
              Auto Refresh
            </strong>

            <span>
              Automatically refresh dashboard data when enabled.
            </span>

          </div>


          <label className="settings-switch">

            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) =>
                setAutoRefresh(event.target.checked)
              }
            />

            <span className="settings-slider"></span>

          </label>

        </div>

      </div>


      {/* ==================== ACCOUNT ==================== */}
      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-card-icon">
            <User size={21} />
          </div>

          <div>
            <h2>Account</h2>
            <p>
              Manage your account and security settings.
            </p>
          </div>

        </div>


        <div className="settings-action-row">

          {/* Profile */}
          <button
            type="button"
            className="settings-action-button"
            onClick={() => navigate("/profile")}
          >
            <User size={18} />
            <span>View Profile</span>
          </button>


          {/* Change Password */}
          <button
            type="button"
            className="settings-action-button"
            onClick={() => navigate("/change-password")}
          >
            <Lock size={18} />
            <span>Change Password</span>
          </button>

        </div>

      </div>


      {/* ==================== SYSTEM INFORMATION ==================== */}
      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-card-icon">
            <CheckCircle size={21} />
          </div>

          <div>
            <h2>System Information</h2>
            <p>
              Current application status.
            </p>
          </div>

        </div>


        <div className="system-info-grid">

          {/* Application */}
          <div className="system-info-item">

            <span>
              Application
            </span>

            <strong>
              Student Course Enrollment System
            </strong>

          </div>


          {/* Status */}
          <div className="system-info-item">

            <span>
              Status
            </span>

            <strong className="system-active">

              <span className="status-dot"></span>

              Active

            </strong>

          </div>


          {/* Environment */}
          <div className="system-info-item">

            <span>
              Environment
            </span>

            <strong>
              Development
            </strong>

          </div>

        </div>

      </div>


      {/* ==================== FOOTER BUTTONS ==================== */}
      <div className="settings-footer">

        {/* Reset */}
        <button
          type="button"
          className="settings-reset-button"
          onClick={handleReset}
        >
          <RotateCcw size={18} />
          <span>Reset</span>
        </button>


        {/* Save */}
        <button
          type="button"
          className="settings-save-button"
          onClick={handleSave}
        >
          <Save size={18} />
          <span>Save Settings</span>
        </button>

      </div>


      {/* ==================== CUSTOM TOAST ==================== */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}

export default Settings;
