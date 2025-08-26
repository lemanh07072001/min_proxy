interface MenuMobileProps {
  setIsOpen?: (isOpen: boolean) => void;
  setMode?: (mode: string) => void;
}

export default function MenuMobile({ setIsOpen, setMode }: MenuMobileProps) {
  const handleLogin = () => {
    if (setMode) setMode('login');
    if (setIsOpen) setIsOpen(true);
  };

  const handleRegister = () => {
    if (setMode) setMode('register');
    if (setIsOpen) setIsOpen(true);
  };

  return (
    <>
      <ul className='navbar-nav mx-auto menu-mobile'>
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
        <button className='btn btn-gradient-primary me-2' onClick={handleRegister}>Đăng ký</button>
        <button className='btn btn-gradient-primary' onClick={handleLogin}>Đăng nhập</button>
      </div>
    </>
  )
}
