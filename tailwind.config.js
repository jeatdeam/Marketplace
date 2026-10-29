// tailwind 3 para la tienda Next.js (guia de estilo ANDESEPPS)
/** @type {import('tailwindcss').Config} */
export default {
    // relative: las rutas se resuelven desde este archivo y no desde donde se lance npm
    content: {
        relative: true,
        files: ['./app/**/*.{ts,tsx}', './Jeatdeam/client/src/**/*.{ts,tsx}'],
    },
    theme: {
        // todas las pantallas como texto y en orden: asi lg le gana a tab y siguen funcionando las
        // variantes min-[...]/max-[...] (tailwind las apaga si alguna pantalla es un objeto {min, max})
        screens: {
            xs: '10px',
            sm: '640px',
            md: '768px',
            tab: '800px', // tablet ancha: de 800 a 1023px (desde 1024px manda lg)
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            fontFamily: {
                sans: ['Poppins', 'Arial', 'Helvetica', 'sans-serif'],
                doto: ['Doto', 'monospace'],
            },
        },
    },
    plugins: [],
};
