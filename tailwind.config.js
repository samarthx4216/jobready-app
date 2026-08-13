/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A0F1E',
          800: '#0F1629',
          700: '#141D35',
        },
        slate: {
          card: '#1E293B',
          border: '#2D3F5E',
        },
        indigo: {
          primary: '#6366F1',
          light: '#818CF8',
          glow: '#6366F133',
        },
        lime: {
          accent: '#84CC16',
          glow: '#84CC1633',
        },
        amber: {
          accent: '#F59E0B',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, #6366F133, transparent)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
        'border-glow': 'borderGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        borderGlow: {
          '0%': { boxShadow: '0 0 5px #6366F144, 0 0 20px #6366F122' },
          '100%': { boxShadow: '0 0 15px #6366F177, 0 0 40px #6366F144' },
        },
      },
      boxShadow: {
        'glow-indigo': '0 0 30px rgba(99, 102, 241, 0.3)',
        'glow-lime': '0 0 30px rgba(132, 204, 22, 0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
