/**
 * SVG icons thật cho các nền tảng liên hệ
 * Dùng ở Homepage sidebar + Floating contact widget
 */

interface IconProps {
  size?: number
  className?: string
}

export const ZaloIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox='0 0 48 48' fill='none' className={className}>
    <path d='M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0z' fill='#0068FF' />
    <path d='M13.2 31.8c0 1.1.9 1.5 1.5 1.5h1.8c.6 0 1.2-.6 1.2-1.2V22.2h-3.3c-.6 0-1.2.6-1.2 1.2v8.4zm19.5-13.5H15.3c-.6 0-1.2.6-1.2 1.2v1.2c0 .6.6 1.2 1.2 1.2h12.6l-13.2 9c-.6.3-.6 1.2-.3 1.8l.6.9c.3.6 1.2.6 1.8.3L32.7 24v7.8c0 .6.6 1.2 1.2 1.2h1.8c.6 0 1.2-.6 1.2-1.2V19.5c0-.6-.6-1.2-1.2-1.2z' fill='#fff' />
  </svg>
)

export const FacebookIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox='0 0 48 48' fill='none' className={className}>
    <path d='M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0z' fill='#1877F2' />
    <path d='M33.12 30.94l1.12-7.32h-7.02v-4.75c0-2 .98-3.96 4.13-3.96h3.2V8.74s-2.9-.5-5.68-.5c-5.8 0-9.59 3.51-9.59 9.88v5.58h-6.44v7.32h6.44V47.7a25.5 25.5 0 007.94 0V30.94h5.9z' fill='#fff' />
  </svg>
)

export const TelegramIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox='0 0 48 48' fill='none' className={className}>
    <path d='M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0z' fill='#2AABEE' />
    <path d='M10.9 23.3l21.6-8.3c1-.4 4.3-1.8 4.3-1.8s1.5-.6 1.4.8c0 .6-.4 2.6-.7 4.8l-2.1 13s-.2 1.4-1.5 1.5c-1.3 0-3.4-2.2-3.8-2.5-1.6-1.2-6.5-4.2-7.8-5.2-.3-.3-.7-.8.1-1.4l8.3-7.6s1-.9 1-1.5c0 0 .1-.5-.8-.1l-11.1 7.1s-1.2.7-3.4.1l-4.8-1.5s-1.2-.7.3-1.4z' fill='#fff' />
  </svg>
)

export const YoutubeIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox='0 0 48 48' fill='none' className={className}>
    <path d='M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0z' fill='#FF0000' />
    <path d='M38.2 17.4s-.3-2.3-1.3-3.3c-1.3-1.3-2.7-1.3-3.3-1.4C29 12.4 24 12.4 24 12.4s-5 0-9.6.3c-.6.1-2 .1-3.3 1.4-1 1-1.3 3.3-1.3 3.3S9.4 20 9.4 22.7v2.5c0 2.7.4 5.3.4 5.3s.3 2.3 1.3 3.3c1.3 1.3 2.9 1.3 3.7 1.4 2.6.3 11.2.3 11.2.3s5 0 9.6-.3c.6-.1 2-.1 3.3-1.4 1-1 1.3-3.3 1.3-3.3s.4-2.7.4-5.3v-2.5c0-2.7-.4-5.3-.4-5.3z' fill='#fff' />
    <path d='M21 28.5v-9l8 4.5-8 4.5z' fill='#FF0000' />
  </svg>
)

// Map icon name → component
export const SOCIAL_ICON_MAP: Record<string, React.FC<IconProps>> = {
  zalo: ZaloIcon,
  facebook: FacebookIcon,
  telegram: TelegramIcon,
  youtube: YoutubeIcon,
}
