import Image from 'next/image'
import { useTheme } from '@/lib/theme'

interface ZodiacIconProps {
  sign: string
  size?: number
  className?: string
}

export default function ZodiacIcon({ sign, size = 24, className = '' }: ZodiacIconProps) {
  const { theme } = useTheme()
  const slug = sign.toLowerCase()
  return (
    <Image
      src={theme === 'dark' ? `/zodiac-icons/${slug}-dark.png` : `/zodiac-icons/${slug}.png`}
      alt={sign}
      width={size}
      height={size}
      className={className}
    />
  )
}
