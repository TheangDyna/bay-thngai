/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      colors: {
        background: "#ffffff",
        foreground: "#000000",
        card: {
          DEFAULT: "#f8f9fa",
          foreground: "#212529"
        },
        popover: {
          DEFAULT: "#f1f3f5",
          foreground: "#343a40"
        },
        primary: {
          DEFAULT: "#ffc300",
          foreground: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#000814",
          foreground: "#FFFFFF"
        },
        error: {
          DEFAULT: "#FF4D4F",
          foreground: "#FFFFFF"
        },
        warning: {
          DEFAULT: "#FFC107",
          foreground: "#212529"
        },
        success: {
          DEFAULT: "#28A745",
          foreground: "#FFFFFF"
        },
        muted: {
          DEFAULT: "#6C757D",
          foreground: "#E9ECEF"
        },
        accent: {
          DEFAULT: "#6F42C1",
          foreground: "#FFFFFF"
        },
        destructive: {
          DEFAULT: "#DC3545",
          foreground: "#FFFFFF"
        },
        border: "#DEE2E6",
        input: "#E9ECEF",
        ring: "#B8DAFF",
        chart: {
          1: "#007BFF",
          2: "#FFC107",
          3: "#28A745",
          4: "#6F42C1",
          5: "#DC3545"
        },
        sidebar: {
          DEFAULT: "#343A40",
          foreground: "#FFFFFF",
          primary: "#1E90FF",
          "primary-foreground": "#FFFFFF",
          accent: "#6F42C1",
          "accent-foreground": "#FFFFFF",
          border: "#DEE2E6",
          ring: "#B8DAFF"
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
