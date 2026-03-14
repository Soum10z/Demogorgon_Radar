/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0a0a',
                'alert-red': '#ff003c',
                'radar-green': '#39ff14'
            },
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                'share-tech': ['"Share Tech Mono"', 'monospace'],
                benguiat: ['"ITC Benguiat"', 'serif']
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar')
    ],
}
