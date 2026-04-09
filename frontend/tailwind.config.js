/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        violet: { 400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9' },
        surface: '#FFFFFF',
        background: '#F5F3FF',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      backgroundImage: {
        'grad-brand':   'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        'grad-sky':     'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
        'grad-emerald': 'linear-gradient(135deg, #059669 0%, #0891B2 100%)',
        'grad-amber':   'linear-gradient(135deg, #D97706 0%, #DC2626 100%)',
        'grad-rose':    'linear-gradient(135deg, #E11D48 0%, #9333EA 100%)',
        'grad-sidebar': 'linear-gradient(180deg, #1E1B4B 0%, #0F172A 100%)',
        'grad-card':    'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        'mesh':         'radial-gradient(at 40% 20%, #818CF8 0px, transparent 50%), radial-gradient(at 80% 0%, #C7D2FE 0px, transparent 50%), radial-gradient(at 0% 50%, #EDE9FE 0px, transparent 50%)',
      },
      boxShadow: {
        'xs':      '0 1px 2px rgba(0,0,0,0.05)',
        'card':    '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 12px rgba(79,70,229,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'card-lg': '0 12px 28px rgba(79,70,229,0.12), 0 4px 8px rgba(0,0,0,0.06)',
        'glow-brand':   '0 0 24px rgba(99,102,241,0.35)',
        'glow-violet':  '0 0 24px rgba(124,58,237,0.35)',
        'glow-emerald': '0 0 20px rgba(5,150,105,0.3)',
        'inner': 'inset 0 1px 3px rgba(0,0,0,0.08)',
      },
      animation: {
        'float-a': 'floatA 4s ease-in-out infinite',
        'float-b': 'floatB 5s ease-in-out infinite',
        'shimmer': 'shimmer 1.6s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        floatA: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        floatB: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-5px)' } },
        shimmer: { '0%': { backgroundPosition: '-500px 0' }, '100%': { backgroundPosition: '500px 0' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem' },
    },
  },
  plugins: [],
}