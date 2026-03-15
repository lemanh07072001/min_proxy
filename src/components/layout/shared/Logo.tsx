/**
 * Logo component — render bằng CSS background-image từ server-side CSS variable.
 *
 * KHÔNG dùng <img> tag hay client API → không bao giờ flash.
 * CSS variable `--site-logo-src` inject bởi layout.tsx từ DB.
 * Site con chưa setup logo → ẩn (CSS variable empty → background-image none).
 */

const Logo = () => {
  return (
    <div
      className='site-logo'
      role='img'
      aria-label='Logo'
      style={{
        width: 180,
        height: 50,
        backgroundImage: 'var(--site-logo)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
      }}
    />
  )
}

export default Logo
