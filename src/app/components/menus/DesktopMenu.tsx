"use client";

import { usePathname } from 'next/navigation'

import MenuLandingPage from '@/data/menus/landing-page/MenuLandingPage'

import Link from '@components/Link'

type DesktopMenu = {
  setIsOpen: (value: boolean) => void;
  setMode: (value: string) => void;
};

export function DesktopMenu({setIsOpen, setMode}: DesktopMenu  ) {
  const pathname = usePathname();

  const handleOpenModalLogin = () => {
    setIsOpen(true);
    setMode('login');
  }

  const handleOpenModalRegister = () => {
    setIsOpen(true);
    setMode('register');
  }

return (
  <>
    <ul className="navbar-nav mx-auto">
      {MenuLandingPage.map(function(item, index) {
        const isActive = pathname === item.href;

        return (
          <li key={index} className="nav-item">
            <Link
              className={`nav-link nav-link-custom ${isActive ? "active" : ""}`}
              href={item.href}>
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
    {/* Auth Buttons */}
    <div className="d-flex align-items-center gap-2">
      <button className="btn btn-gradient-primary me-2" onClick={handleOpenModalRegister}>Đăng ký</button>
      <button className="btn btn-gradient-primary" onClick={handleOpenModalLogin}>Đăng nhập</button>
    </div>
  </>
)
}