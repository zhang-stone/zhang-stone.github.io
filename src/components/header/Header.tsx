import { BluredBackground } from './BluredBackground'
import { HeaderContent } from './HeaderContent'
import { SearchButton } from './SearchButton'
import { AnimatedLogo } from './AnimatedLogo'
import { HeaderMeta } from './HeaderMeta'
import { useIsMobile } from './hooks'
import { ThemeSwitch } from '@/components/footer/ThemeSwitch'

export function Header() {
  const isMobile = useIsMobile()

  return (
    <header className="fixed top-0 inset-x-0 h-[64px] z-10 overflow-hidden">
      <BluredBackground />
      <div className="max-w-[1100px] h-full md:px-4 mx-auto grid grid-cols-[64px_auto]">
        <div className="flex items-center justify-center">
          <AnimatedLogo />
        </div>
        <div className="flex items-center justify-end space-x-4">
          <SearchButton />
          <ThemeSwitch />
        </div>
      </div>
    </header>
  )
}
