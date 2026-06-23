// tailwind.config.js
export default {
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          from: {
            opacity: "0",
            transform: "translateY(24px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
      },
    },
  },
};