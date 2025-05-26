module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        brand: {
          DEFAULT: "#58C063",  //  ✅ main accent  (#58c063 ≈ the buttons)
          dark: "#32A844",  //  hover / pressed
          light: "#E7F7E9",  //  10% tint   (icon backgrounds, chips)
        },
        green: {
          600: '#5DD62C',
          700: '#4caf21',
        },
        surface: "#FFFFFF",  //  page & cards
        subtle: "#F5F6F9",  //  card hover / alt rows
        border: "#E0E2E8",  //  strokes
        ink: "#1F2432",  //  main text
        inkMuted: "#4D5566",  //  secondary text
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 