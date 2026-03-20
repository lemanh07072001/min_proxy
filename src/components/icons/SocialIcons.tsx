/**
 * SVG icons chính thức cho các nền tảng liên hệ
 * Path lấy từ brand assets chính thức
 */

interface IconProps {
  size?: number
  className?: string
}

export const ZaloIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox='0 0 48 48' className={className}>
    <rect width='48' height='48' rx='24' fill='#0068FF' />
    <path fillRule='evenodd' clipRule='evenodd' d='M12.5 26.8C12.5 19.5 17.6 14 24.2 14c6 0 11.3 5 11.3 11.5 0 .6 0 1.1-.1 1.7v.2c-.5 4.8-4.7 8.8-9.6 9.8-.6.1-1.1.2-1.6.2-1.2 0-2.3-.2-3.4-.6l-.3-.1-3.6 1 1-3.2-.2-.3c-1.3-1.8-2.2-4-2.2-6.4zm5.2 1.7v3c0 .4.3.5.5.5h.7c.4 0 .5-.3.5-.5v-5.2h-1.2c-.3 0-.5.2-.5.5v1.7zm8-4.7h-4.4c-.3 0-.5.2-.5.5v.4c0 .3.2.5.5.5h2.5c.1 0 .2.1.1.2l-3.3 4.4c-.1.2-.2.3-.2.5v.2c0 .3.2.5.5.5h4.7c.3 0 .5-.2.5-.5v-.4c0-.3-.2-.5-.5-.5h-2.7c-.1 0-.2-.1-.1-.2l3.3-4.4c.1-.2.2-.3.2-.5v-.2c0-.3-.2-.5-.5-.5zm4.6 0c-1.7 0-3 1.4-3 3.3s1.3 3.3 3 3.3 3-1.4 3-3.3-1.3-3.3-3-3.3zm0 5.2c-.8 0-1.5-.8-1.5-1.9 0-1.1.7-1.9 1.5-1.9s1.5.8 1.5 1.9c0 1.1-.7 1.9-1.5 1.9z' fill='#fff' />
  </svg>
)

export const FacebookIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox='0 0 48 48' className={className}>
    <rect width='48' height='48' rx='24' fill='#1877F2' />
    <path d='M33.12 30.94l1.12-7.32h-7.02v-4.75c0-2 .98-3.96 4.13-3.96h3.2V8.74s-2.9-.5-5.68-.5c-5.8 0-9.59 3.51-9.59 9.88v5.58h-6.44v7.32h6.44v17.68a25.5 25.5 0 007.94 0V30.94h5.9z' fill='#fff' />
  </svg>
)

export const TelegramIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox='0 0 48 48' className={className}>
    <rect width='48' height='48' rx='24' fill='#2AABEE' />
    <path d='M34.27 13.73l-4.56 21.48c-.34 1.52-1.24 1.9-2.52 1.18l-6.96-5.13-3.36 3.23c-.37.37-.68.68-1.4.68l.5-7.1 12.93-11.69c.56-.5-.12-.78-.87-.28L17.24 27.2l-6.86-2.14c-1.49-.47-1.52-1.49.31-2.21l26.82-10.33c1.24-.47 2.33.28 1.92 2.09l.84-1.88z' fill='#fff' />
  </svg>
)

export const YoutubeIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox='0 0 48 48' className={className}>
    <rect width='48' height='48' rx='24' fill='#FF0000' />
    <path d='M37.2 17.8c-.3-1.3-1.3-2.3-2.6-2.6C32.4 14.6 24 14.6 24 14.6s-8.4 0-10.6.5c-1.3.3-2.3 1.3-2.6 2.6-.5 2.3-.5 7-.5 7s0 4.8.5 7c.3 1.3 1.3 2.3 2.6 2.6 2.2.5 10.6.5 10.6.5s8.4 0 10.6-.5c1.3-.3 2.3-1.3 2.6-2.6.5-2.3.5-7 .5-7s0-4.8-.5-7.1z' fill='#fff' />
    <path d='M21.2 29.1l7.1-4.3-7.1-4.3v8.6z' fill='#FF0000' />
  </svg>
)

// Map icon name → component
export const SOCIAL_ICON_MAP: Record<string, React.FC<IconProps>> = {
  zalo: ZaloIcon,
  facebook: FacebookIcon,
  telegram: TelegramIcon,
  youtube: YoutubeIcon,
}
