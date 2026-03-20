/**
 * Brand icons — SVG paths chuẩn từ SimpleIcons / brand assets
 */

interface IconProps {
  size?: number
  className?: string
}

export const ZaloIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox='0 0 48 48' className={className}>
    <defs>
      <linearGradient id='zalo-grad' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0%' stopColor='#0068FF' />
        <stop offset='100%' stopColor='#0052CC' />
      </linearGradient>
    </defs>
    <rect width='48' height='48' rx='12' fill='url(#zalo-grad)' />
    <text x='24' y='33' textAnchor='middle' fontFamily='Arial,Helvetica,sans-serif' fontWeight='900' fontSize='28' fill='#fff' letterSpacing='-1'>Z</text>
  </svg>
)

export const FacebookIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox='0 0 48 48' className={className}>
    <rect width='48' height='48' rx='12' fill='#1877F2' />
    <path d='M29.72 25.5l.85-5.52h-5.3v-3.58c0-1.51.74-2.98 3.11-2.98h2.41V8.64s-2.18-.37-4.27-.37c-4.36 0-7.21 2.64-7.21 7.43v4.2h-4.85v5.52h4.85V39.2a19.2 19.2 0 005.98 0V25.5h4.43z' fill='#fff' />
  </svg>
)

export const TelegramIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox='0 0 48 48' className={className}>
    <defs>
      <linearGradient id='tg-grad' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0%' stopColor='#37AEE2' />
        <stop offset='100%' stopColor='#1E96C8' />
      </linearGradient>
    </defs>
    <rect width='48' height='48' rx='12' fill='url(#tg-grad)' />
    <path d='M10.68 23.62l7.2 2.7 2.78 8.94c.18.57.88.75 1.3.33l4-3.87a1.12 1.12 0 011.37-.05l7.22 5.24c.5.36 1.2.06 1.3-.55l4.72-22.72c.12-.67-.54-1.22-1.16-.97L10.66 22.2c-.72.28-.7 1.3.02 1.42zm10.04 1.2l14.54-8.96c.28-.17.56.2.32.42L23 28.08c-.4.37-.66.88-.73 1.43l-.38 2.86c-.05.38-.58.42-.7.06l-1.7-5.16a.93.93 0 01.43-1.12l.7-.33z' fill='#fff' />
  </svg>
)

export const YoutubeIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox='0 0 48 48' className={className}>
    <rect width='48' height='48' rx='12' fill='#FF0000' />
    <path d='M37.2 17.8c-.3-1.3-1.3-2.3-2.6-2.6C32.4 14.6 24 14.6 24 14.6s-8.4 0-10.6.5c-1.3.3-2.3 1.3-2.6 2.6-.5 2.3-.5 7-.5 7s0 4.8.5 7c.3 1.3 1.3 2.3 2.6 2.6 2.2.5 10.6.5 10.6.5s8.4 0 10.6-.5c1.3-.3 2.3-1.3 2.6-2.6.5-2.3.5-7 .5-7s0-4.8-.5-7.1z' fill='#fff' />
    <path d='M21.2 29.1l7.1-4.3-7.1-4.3v8.6z' fill='#FF0000' />
  </svg>
)

export const SOCIAL_ICON_MAP: Record<string, React.FC<IconProps>> = {
  zalo: ZaloIcon,
  facebook: FacebookIcon,
  telegram: TelegramIcon,
  youtube: YoutubeIcon,
}
