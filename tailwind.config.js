/** @type {import('tailwindcss').Config} */
const {Colors} = require("./constants/Colors");
module.exports = {
    content: [
        "./components/**/*.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {

        extend: {

            colors: Colors,
            fontSize:{
                '2xs': '0.625rem',
            }
        },
    },
    plugins: [function ({ addUtilities }) {
        const newUtilities = {};
        for (let i = 1; i <= 100; i++) {
            newUtilities[`.size-${i}`] = {
                width: `${i}px`,
                height: `${i}px`,
            };
        }
        addUtilities(newUtilities, ['responsive', 'hover']);
    }],
}

