export function changePageTheme(theme: string) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
}

export function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const themeKey = 'gyoza-theme'

export function getLocalTheme() {
  if (typeof localStorage === 'undefined') return 'system'
  const local = localStorage.getItem(themeKey)
  if (local === 'dark' || local === 'light') {
    return local
  } else {
    setLocalTheme('system')
    return 'system'
  }
}

export function setLocalTheme(theme: string) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(themeKey, theme)
}
