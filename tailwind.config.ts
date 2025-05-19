export default {
  content: ['./src/app/*/*.{tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-background': '#2C2F33',
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
      },
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
}
