import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--spacing-md) var(--spacing-lg)",
        backgroundColor: "var(--color-bg-primary)",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-lg)",
          flex: 1,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              margin: 0,
              color: "var(--color-text-primary)",
            }}
          >
            Task Management
          </h1>
        </div>
      </div>

      {user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-md)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "var(--color-text-primary)",
              }}
            >
              {user.firstname} {user.lastname}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-secondary)",
              }}
            >
              {user.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "var(--spacing-sm) var(--spacing-md)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-xs)",
              color: "var(--color-text-secondary)",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                "var(--color-status-in-progress)";
              e.currentTarget.style.color = "var(--color-status-in-progress)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            <FiLogOut size={18} />
            <span style={{ fontSize: "0.875rem" }}>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};
