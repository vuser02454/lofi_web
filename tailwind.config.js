/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-surface-variant": "#49454e",
        "surface": "#fcf9f4",
        "outline-variant": "#cbc4cf",
        "tertiary-fixed": "#fadccf",
        "outline": "#7a757f",
        "surface-tint": "#665689",
        "on-tertiary": "#ffffff",
        "on-error-container": "#93000a",
        "on-surface": "#1c1c19",
        "error": "#ba1a1a",
        "on-primary-fixed": "#211141",
        "surface-variant": "#e5e2dd",
        "on-tertiary-fixed-variant": "#564239",
        "on-error": "#ffffff",
        "surface-container-low": "#f6f3ee",
        "on-primary": "#ffffff",
        "secondary-fixed-dim": "#ffb696",
        "on-secondary-container": "#7a452c",
        "secondary-fixed": "#ffdbcd",
        "tertiary": "#6d574d",
        "surface-container-highest": "#e5e2dd",
        "background": "#fcf9f4",
        "secondary-container": "#ffb696",
        "tertiary-fixed-dim": "#ddc1b4",
        "on-tertiary-container": "#fffbff",
        "inverse-surface": "#31302d",
        "surface-container-lowest": "#ffffff",
        "primary-fixed": "#eaddff",
        "on-primary-container": "#fffbff",
        "primary-fixed-dim": "#d0bdf8",
        "on-secondary-fixed-variant": "#6c3922",
        "surface-container-high": "#ebe8e3",
        "on-background": "#1c1c19",
        "on-tertiary-fixed": "#271810",
        "on-secondary-fixed": "#351000",
        "on-secondary": "#ffffff",
        "inverse-primary": "#d0bdf8",
        "inverse-on-surface": "#f3f0eb",
        "surface-bright": "#fcf9f4",
        "secondary": "#885037",
        "surface-container": "#f0ede9",
        "primary": "#635387",
        "primary-container": "#7c6ca1",
        "on-primary-fixed-variant": "#4e3e70",
        "surface-dim": "#dcdad5",
        "tertiary-container": "#877065",
        "error-container": "#ffdad6"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "64px",
        "gutter": "24px",
        "margin-mobile": "20px",
        "unit": "8px",
        "container-max-width": "1120px"
      },
      fontFamily: {
        "headline-lg": ["Vollkorn"],
        "label-md": ["Plus Jakarta Sans"],
        "body-md": ["Plus Jakarta Sans"],
        "headline-lg-mobile": ["Vollkorn"],
        "body-lg": ["Plus Jakarta Sans"],
        "headline-xl": ["Vollkorn"]
      },
      fontSize: {
        "headline-lg": ["32px", {"lineHeight": "1.3", "fontWeight": "600"}],
        "label-md": ["14px", {"lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-lg-mobile": ["28px", {"lineHeight": "1.3", "fontWeight": "600"}],
        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-xl": ["48px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}]
      }
    }
  }
}
