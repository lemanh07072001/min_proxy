export default function MenuDesktop() {
  return (
    <>
      <ul className='navbar-nav mx-auto'>
        <li className='nav-item'>
          <a className='nav-link nav-link-custom' href='#'>
            Trang chủ
          </a>
        </li>
        <li className='nav-item'>
          <a className='nav-link nav-link-custom' href='#'>
            Giới thiệu
          </a>
        </li>
        <li className='nav-item'>
          <a className='nav-link nav-link-custom' href='#'>
            Đại lý
          </a>
        </li>
        <li className='nav-item'>
          <a className='nav-link nav-link-custom' href='#'>
            Mua Proxy
          </a>
        </li>
        <li className='nav-item'>
          <a className='nav-link nav-link-custom' href='#'>
            Chọn Template
          </a>
        </li>
        <li className='nav-item'>
          <a className='nav-link nav-link-custom' href='#'>
            Liên hệ
          </a>
        </li>
      </ul>

      <div className='d-flex align-items-center gap-2'>
        <button className='btn btn-gradient-primary me-2'>Đăng ký</button>
        <button className='btn btn-gradient-primary'>Đăng nhập</button>
      </div>
    </>
  )
}
