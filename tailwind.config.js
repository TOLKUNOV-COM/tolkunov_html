/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,jade,js,less}",
    "./src/templates/**/*.{jade,pug,html}",
    "./src/blocks/**/*.{jade,js,less}",
    "./build/**/*.html"
  ],
  safelist: [
    'opacity-0',
    'opacity-100',
    'pointer-events-none',
    'pointer-events-auto',
  ],
    theme: {
        extend: {},
    },
    plugins: [
        function ({ matchUtilities }) {
            matchUtilities(
                {
                    zoom: (value) => ({ zoom: value }),
                },
                { values: {} } // Разрешаем любые значения в []
            );
        }
    ],
};
