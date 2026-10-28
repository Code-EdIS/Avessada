
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./html/**/*.html",
    "./js/**/*.js"
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#10264a",
          950: "#071426"
        }
      },

      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },

      boxShadow: {
        glow: "0 0 45px rgba(59, 130, 246, 0.20)",
        card: "0 20px 60px rgba(7, 20, 38, 0.08)"
      },

      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at 70% 30%, rgba(59,130,246,0.18), transparent 35%)",
        "brand-gradient":
          "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)"
      }
    }
  },

  plugins: []
};
