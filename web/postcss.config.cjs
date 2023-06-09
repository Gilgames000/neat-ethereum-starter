const tailwindcss = require('tailwindcss');
const tailwindNesting = require('tailwindcss/nesting');
const autoprefixer = require('autoprefixer');

const config = {
    plugins: [
        //Some plugins, like tailwindcss/nesting, need to run before Tailwind,
        tailwindNesting(),
        tailwindcss(),
        //But others, like autoprefixer, need to run after,
        autoprefixer()
    ]
};

module.exports = config;
