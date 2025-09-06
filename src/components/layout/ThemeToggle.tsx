// "use client"

// import { useTheme } from '@/contexts/ThemeContext'

// export default function ThemeToggle() {
//   const { theme, setTheme, isDark } = useTheme()

//   const toggleTheme = () => {
//     if (theme === 'light') {
//       setTheme('dark')
//     } else if (theme === 'dark') {
//       setTheme('auto')
//     } else {
//       setTheme('light')
//     }
//   }

//   const getIcon = () => {
//     switch (theme) {
//       case 'light':
//         return '☀️'
//       case 'dark':
//         return '🌙'
//       case 'auto':
//         return '🔄'
//       default:
//         return '☀️'
//     }
//   }

//   const getTooltip = () => {
//     switch (theme) {
//       case 'light':
//         return 'Switch to dark mode'
//       case 'dark':
//         return 'Switch to auto mode'
//       case 'auto':
//         return 'Switch to light mode'
//       default:
//         return 'Toggle theme'
//     }
//   }

//   return (
//     <button
//       onClick={toggleTheme}
//       title={getTooltip()}
//       className={`
//         p-2 rounded-lg transition-colors duration-200
//         ${isDark 
//           ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
//           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//         }
//       `}
//     >
//       <span className="text-lg">{getIcon()}</span>
//       <span className="sr-only">{getTooltip()}</span>
//     </button>
//   )
// }