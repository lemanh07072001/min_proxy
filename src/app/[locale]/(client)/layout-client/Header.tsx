import React from 'react';
import { Bell, User, Star, Menu, Search } from 'lucide-react';
import LanguageSelect from '@components/language-selector/LanguageSelect'

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {

  return (
    <>
      {/* Main Header */}
      <header className="modern-header">
        <div className="header-container">
          <div className="header-content">
            <div className="header-brand">
              <div className="brand-logo">
                <div className="logo-icon">🔒</div>
                <div className="brand-text">
                  <span className="brand-name">HomeProxy</span>
                  <span className="brand-tagline">Professional</span>
                </div>
              </div>
              <button className="sidebar-toggle" onClick={onToggleSidebar}>
                <Menu size={20} />
              </button>
            </div>

            <div className="header-search">
              <div className="search-container">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm kiếm proxy, location..."
                />
              </div>
            </div>


            <div className="header-actions-container">

              <div className="header-actions">
                <LanguageSelect/>
                <div className="notification-badge">
                  <Bell size={20} />
                  <span className="badge">3</span>
                </div>

                <div className="user-profile">
                  <User size={20} />
                  <span>Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Promotion Banner */}
      <div className="promo-banner">
        <div className="promo-container">
          <div className="promo-content">
            <div className="promo-icon">🎉</div>
            <div className="promo-text">
              <strong>Khuyến mãi đặc biệt!</strong> Tuyển đại lý cấp website riêng - Liên hệ: 0399699675
            </div>
            <button className="promo-close">×</button>
          </div>
        </div>
      </div>

    </>
  );
};

export default Header;