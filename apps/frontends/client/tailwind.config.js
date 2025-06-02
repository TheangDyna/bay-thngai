/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        text: "#1D1616", // Text color
        primary: {
          DEFAULT: "#16C47F", // Primary color
          foreground: "#FFFFFF" // Text color for primary
        },
        secondary: "#FFD65A", // Secondary color
        accent: "#FF9D23", // Accent color
        error: "#F93827", // Error color (you can replace this or keep it as is)
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
        success: {
          DEFAULT: "#28A745",
          foreground: "#FFFFFF"
        },
        muted: {
          DEFAULT: "#6C757D",
          foreground: "#E9ECEF"
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
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
