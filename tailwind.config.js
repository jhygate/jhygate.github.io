/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                "blue-black": "#1e152a",
                "dark-green": "#4e6766",
                "light-blue": "#5ab1bb",
                "light-green": "#a5c882",
                "jack-yellow": "#f7dd72",
            },
        },
    },
    plugins: [],
    important: true,
};


