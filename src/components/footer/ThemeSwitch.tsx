import { themeAtom } from '@/store/theme'
import { useAtom } from 'jotai'
import { useSound } from 'use-sound'
import switchOnSound from '@/assets/sound/switch-on.mp3'
import switchOffSound from '@/assets/sound/switch-off.mp3'

export function ThemeSwitch() {
  const [theme, setTheme] = useAtom(themeAtom)
  const [playThemeSwitchSound] = useSound(theme === 'light' ? switchOnSound : switchOffSound, {
    volume: 0.25
  })

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    playThemeSwitchSound();
    setTheme(newTheme)
  }

  return (
    <div className="relative">
      <button
        className="border border-primary p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
        type="button"
        aria-label={theme === 'light' ? '切换到深色主题' : '切换到浅色主题'}
        onClick={toggleTheme}
      >
        <div className="flex items-center justify-center w-5 h-5">
          <i 
            className={`iconfont text-lg transition-all duration-300 ${
              theme === 'light' ? 'icon-moon' : 'icon-sun'
            }`}
          ></i>
        </div>
      </button>
    </div>
  )
}
