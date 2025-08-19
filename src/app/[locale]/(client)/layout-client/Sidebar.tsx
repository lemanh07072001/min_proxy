import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Globe, ShoppingCart, FileText, Clock, User, History, HelpCircle, Wallet, Plus, ChevronDown, ChevronRight
} from 'lucide-react';

// -- CSS ĐƯỢC TÍCH HỢP TRỰC TIẾP VÀO COMPONENT --
// Điều này giải quyết lỗi không tìm thấy file "./Sidebar.css"
const GlobalStyles = () => {
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      :root {
          --primary-gradient: linear-gradient(45deg, #FC4336, #F88A4B);
          --primary-color: #FC4336;
      }

      .modern-sidebar {
          background: white;
          width: 260px;
          height: calc(100vh - 120px);
          padding: 24px;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 120px;
          overflow-y: auto;
      }

      .modern-sidebar.collapsed {
          padding: 24px 12px;
      }

      .modern-sidebar::-webkit-scrollbar { width: 4px; }
      .modern-sidebar::-webkit-scrollbar-track { background: #f1f1f1; }
      .modern-sidebar::-webkit-scrollbar-thumb { background: #c7c7c7; border-radius: 8px; }
      .modern-sidebar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }

      .sidebar-content-container {
          overflow: hidden;
          flex-shrink: 0;
          transform-origin: left;
      }

      .modern-sidebar.collapsed .sidebar-content-container {
          display: none;
      }

      .wallet-card {
          background: var(--primary-gradient);
          border-radius: 16px;
          padding: 20px;
          color: white;
          margin-bottom: 32px;
          box-shadow: 0 8px 25px rgba(252, 67, 54, 0.3);
      }

      .wallet-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; opacity: 0.9; }
      .wallet-title { font-size: 14px; font-weight: 500; }
      .wallet-balance { margin-bottom: 16px; }
      .balance-amount { font-size: 24px; font-weight: 700; display: block; }
      .balance-currency { font-size: 14px; opacity: 0.8; }
      .wallet-actions { display: flex; gap: 8px; }

      .btn-primary, .btn-secondary {
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
      }
      .btn-primary { background: rgba(255, 255, 255, 0.2); }
      .btn-primary:hover { background: rgba(255, 255, 255, 0.3); }
      .btn-secondary { background: transparent; }
      .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); }

      .nav-section { margin-bottom: 32px; }
      .nav-title { font-size: 12px; font-weight: 600; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; white-space: nowrap; transform-origin: left; }
      .nav-menu { display: flex; flex-direction: column; gap: 4px; }

      .nav-item {
          display: block; width: 100%; background: none; border: none;
          text-decoration: none; color: #4a5568; padding: 12px 16px;
          border-radius: 12px;
          transition: background-color 0.3s ease, color 0.3s ease;
          position: relative; cursor: pointer; text-align: left;
      }
      .nav-item:hover { background: #f7fafc; color: #2d3748; text-decoration: none; }
      .nav-item.active { background: var(--primary-gradient); color: white; box-shadow: 0 4px 12px rgba(252, 67, 54, 0.3); }

      .nav-item-content { display: flex; align-items: center; justify-content: space-between; }
      .nav-item-left { display: flex; align-items: center; gap: 12px; overflow: hidden; }
      .nav-item-right { display: flex; align-items: center; gap: 8px; transform-origin: right; }
      .nav-label { font-size: 14px; font-weight: 500; white-space: nowrap; transform-origin: left; }
      .nav-count { background: rgba(160, 174, 192, 0.2); color: #718096; font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600; }
      .nav-item.active .nav-count { background: rgba(255, 255, 255, 0.2); color: white; }
      .nav-chevron { color: #a0aec0; transition: color 0.3s ease; }
      .nav-item.active .nav-chevron { color: white; }

      .submenu {
          margin-left: 16px;
          margin-top: 4px;
          border-left: 2px solid #e2e8f0;
          padding-left: 16px;
          overflow: hidden;
      }
      .submenu-item { padding: 8px 12px !important; font-size: 13px; }
      .submenu-item .nav-item-left { gap: 16px !important; }
      .submenu-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #cbd5e0;
          transition: background-color 0.3s ease, transform 0.3s ease;
      }
      .submenu-item.active .submenu-dot { background: white; transform: scale(1.2); }
      .submenu-item:hover:not(.active) .submenu-dot { background: var(--primary-color); }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return null;
};


interface SidebarProps {
  collapsed: boolean;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const sidebarVariants = {
  expanded: {
    width: '260px',
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  collapsed: {
    width: '80px',
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
};

const contentContainerVariants = {
  expanded: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: 'easeOut', delay: 0.1 }
  },
  collapsed: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

const labelVariants = {
  expanded: {
    opacity: 1,
    width: 'auto',
    scale: 1,
    transition: { duration: 0.2, delay: 0.1 }
  },
  collapsed: {
    opacity: 0,
    width: 0,
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

const submenuVariants = {
  enter: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeInOut' } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: 'easeInOut' } }
};


const Sidebar: React.FC<SidebarProps> = ({ collapsed, currentPage, onPageChange }) => {
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>(['proxy']);

  const toggleMenu = (menuId: string) => {
    if (collapsed) return;
    setExpandedMenus(prev => prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]);
  };

  const menuItems = [
    { icon: BarChart3, label: 'Tổng quan', page: 'overview' },
    {
      icon: Globe,
      label: 'Proxy Tĩnh',
      page: 'proxy',
      isParent: true,
      children: [
        { label: 'Proxy Tĩnh', page: 'static-proxy', count: 12 },
        { label: 'Proxy Xoay', page: 'proxy-xoay', count: 8 }
      ]
    },
    { icon: ShoppingCart, label: 'Check Proxy', page: 'check-proxy' },
    { icon: FileText, label: 'Đơn hàng Proxy', page: 'proxy-orders', count: 5 },
    { icon: Clock, label: 'Đơn hàng Proxy xoay', page: 'rotating-orders', count: 2 },
    { icon: History, label: 'Lịch sử mua hàng', page: 'purchase-history' },
    { icon: FileText, label: 'Lịch sử giao dịch', page: 'transaction-history' },
    { icon: History, label: 'Lịch sử đổi proxy', page: 'change-history' },
    { icon: User, label: 'Hướng dẫn', page: 'guide' },
    { icon: HelpCircle, label: 'Hỗ trợ', page: 'support' },
  ];

  return (
    <>
      <GlobalStyles />
      <motion.div
        className={`modern-sidebar ${collapsed ? 'collapsed' : ''}`}
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        initial={false}
      >
        <motion.div
          className="sidebar-content-container"
          variants={contentContainerVariants}
          animate={collapsed ? 'collapsed' : 'expanded'}
        >
          <div className="wallet-card">
            <div className="wallet-header">
              <Wallet size={16} />
              <span className="wallet-title">Ví của bạn</span>
            </div>
            <div className="wallet-balance">
              <span className="balance-amount">2,450,000</span>
              <span className="balance-currency">VNĐ</span>
            </div>
            <div className="wallet-actions">
              <button className="btn-primary"><Plus size={14} /> Nạp tiền</button>
              <button className="btn-secondary">Rút tiền</button>
            </div>
          </div>
        </motion.div>

        <div className="nav-section">
          <motion.div
            className="nav-title"
            variants={contentContainerVariants}
            animate={collapsed ? 'collapsed' : 'expanded'}
          >
            Menu chính
          </motion.div>
          <nav className="nav-menu">
            {menuItems.map((item, index) => (
              <div key={index}>
                <button
                  onClick={() => item.isParent ? toggleMenu(item.page) : onPageChange(item.page)}
                  className={`nav-item ${currentPage === item.page || (item.children && item.children.some(child => child.page === currentPage)) ? 'active' : ''}`}
                  title={collapsed ? item.label : ''}
                >
                  <div className="nav-item-content">
                    <div className="nav-item-left">
                      <item.icon size={18} className="nav-icon" />
                      <motion.span
                        className="nav-label"
                        variants={labelVariants}
                      >
                        {item.label}
                      </motion.span>
                    </div>
                    <motion.div className="nav-item-right" variants={labelVariants}>
                      {item.count && <span className="nav-count">{item.count}</span>}
                      {item.isParent && (
                        <div className="nav-chevron">
                          {expandedMenus.includes(item.page) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {!collapsed && expandedMenus.includes(item.page) && item.children && (
                    <motion.div
                      key="submenu" className="submenu"
                      variants={submenuVariants} initial="exit" animate="enter" exit="exit"
                    >
                      {item.children.map((child, childIndex) => (
                        <button
                          key={childIndex} onClick={() => onPageChange(child.page)}
                          className={`nav-item submenu-item ${currentPage === child.page ? 'active' : ''}`}
                        >
                          <div className="nav-item-content">
                            <div className="nav-item-left">
                              <div className="submenu-dot"></div>
                              <span className="nav-label">{child.label}</span>
                            </div>
                            {child.count && <span className="nav-count">{child.count}</span>}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
};



export default Sidebar;
