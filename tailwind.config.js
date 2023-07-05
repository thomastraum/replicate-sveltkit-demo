/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      'serif': ['Times New Roman', 'Times']
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
