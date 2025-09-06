// "use client"

// import React, { createContext, useContext, useEffect, useState } from 'react'

// type Theme = 'light' | 'dark' | 'auto'

// interface ThemeContextType {
//   theme: Theme
//   setTheme: (theme: Theme) => void
//   isDark: boolean
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [theme, setTheme] = useState<Theme>('light')
//   const [isDark, setIsDark] = useState(false)

//   useEffect(() => {
//     // Load theme from localStorage on mount
//     const savedTheme = localStorage.getItem('theme') as Theme
//     if (savedTheme) {
//       setTheme(savedTheme)
//     } else {
//       // Default to light theme
//       setTheme('light')
//     }
//   }, [])

//   useEffect(() => {
//     const updateTheme = () => {
//       let effectiveTheme: 'light' | 'dark'

//       if (theme === 'auto') {
//         effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
//       } else {
//         effectiveTheme = theme
//       }

//       setIsDark(effectiveTheme === 'dark')
      
//       // Update document class and CSS variables
//       const root = document.documentElement
      
//       if (effectiveTheme === 'dark') {
//         root.classList.add('dark')
//         root.style.setProperty('--background', '#0a0a0a')
//         root.style.setProperty('--foreground', '#ededed')
//       } else {
//         root.classList.remove('dark')
//         root.style.setProperty('--background', '#f9fafb')
//         root.style.setProperty('--foreground', '#111827')
//       }

//       // Save to localStorage
//       localStorage.setItem('theme', theme)
//     }

//     updateTheme()

//     // Listen for system theme changes when theme is 'auto'
//     if (theme === 'auto') {
//       const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
//       mediaQuery.addEventListener('change', updateTheme)
//       return () => mediaQuery.removeEventListener('change', updateTheme)
//     }
//   }, [theme])

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

// export function useTheme() {
//   const context = useContext(ThemeContext)
//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider')
//   }
//   return context
// }