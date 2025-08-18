type AuthProps = {
  setIsOpen: (value: boolean) => void
  setMode: (value: string) => void
}

export default function MenuDesktop({ setIsOpen, setMode }: AuthProps) {
  const handleOpenModalLogin = () => {
    setIsOpen(true)
    setMode('login')
  }

  const handleOpenModalRegister = () => {
    setIsOpen(true)
    setMode('register')
  }

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
        <button className='btn btn-gradient-primary me-2' onClick={handleOpenModalRegister}>
          Đăng ký
        </button>
        <button className='btn btn-gradient-primary' onClick={handleOpenModalLogin}>
          Đăng nhập
        </button>
      </div>
    </>
  )
}
