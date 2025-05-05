import React from "react";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<Props> = ({ children, onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}
    onClick={onClose}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "relative",
        width: "90%",
        maxWidth: 800,
        maxHeight: "90%",
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden"
      }}
    >
      <button
        onClick={onClose}
        style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);
