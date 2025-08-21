import { useParams, usePathname } from 'next/navigation'

import {
  ChartColumn,
  Plus,
  Wallet,
  Globe,
  CircleSmall,
  ShoppingBag,
  History,
  ReceiptText,
  PackagePlus,
  FileText,
  User,
  MessageCircleQuestionMark
} from 'lucide-react'

// MUI Imports
import { useTheme } from '@mui/material/styles'

import { motion, AnimatePresence } from 'framer-motion'

import PerfectScrollbar from 'react-perfect-scrollbar'

import Link from '@components/Link'

import { menuClasses } from '@menu/utils/menuClasses'

// Third-party Imports

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, MenuSection, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'

import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

// =================================================================
// 1. TẬP TRUNG CÁC GIÁ TRỊ VÀO MỘT NƠI (THEME/CONSTANTS)
// =================================================================
const colors = {
  textDefault: '#4a5568',
  textHover: '#2d3748',
  textMuted: '#a0aec0',
  bgHover: '#f7fafc',
  iconHoverSpecial: '#FC4336',
  textActive: '#ffffff',
  bgActive: '#F88A4B'
}

const fontSizes = {
  label: '14px',
  menuItem: '12px'
}

// =================================================================
// 2. TÁCH CÁC OBJECT STYLES RA NGOÀI
// =================================================================

// Style cho tiêu đề của Section (ví dụ: 'Trang chủ')
const menuSectionHeaderStyles = {
  fontSize: fontSizes.label,
  fontWeight: 600,
  color: colors.textMuted,
  padding: '0',
  marginBottom: '1rem'
}

// Style sẽ được áp dụng KHI một mục menu được active
const activeMenuItemStyles = {
  ['.' + menuClasses.button]: {
    backgroundColor: colors.bgActive,
    color: `${colors.textActive} !important`
  },
  ['.' + menuClasses.icon]: {
    color: colors.textActive
  }
}

// Style cơ bản, dùng chung cho tất cả MenuItem và SubMenu
const baseMenuItemStyles = {
  ['.' + menuClasses.button]: {
    width: '100%',
    color: `${colors.textDefault} !important`,
    fontSize: fontSizes.label,
    '&:hover': {
      backgroundColor: `${colors.bgHover} !important`,
      color: `${colors.textHover} !important`
    }
  },
  ['.' + menuClasses.label]: {
    marginTop: '2px',
    display: 'inline'
  }
}

// Style riêng cho SubMenu khi nó được mở (active)
const activeSubMenuStyles = {
  ['&.' + menuClasses.open + ' > .' + menuClasses.button]: {
    backgroundColor: colors.bgActive,
    color: colors.textActive,
    fontSizes: fontSizes.menuItem
  }
}

// Style đặc biệt cho MenuItem 'Proxy tĩnh' khi hover
const staticProxyItemHoverStyles = {
  ['.' + menuClasses.button]: {
    '&:hover': {
      ['& .' + menuClasses.icon]: {
        color: colors.iconHoverSpecial
      }
    }
  }
}

// Kết hợp các style lại với nhau
const getSubMenuStyles = () => ({
  ...baseMenuItemStyles,
  ...activeSubMenuStyles,
  ['.' + menuClasses.label]: {
    ...baseMenuItemStyles['.' + menuClasses.label],
    fontSize: fontSizes.label
  }
})

const getStaticProxyItemStyles = () => ({
  ...baseMenuItemStyles,
  ['.' + menuClasses.label]: {
    ...baseMenuItemStyles['.' + menuClasses.label],
    fontSize: fontSizes.label
  },
  ['.' + menuClasses.button]: {
    ...baseMenuItemStyles['.' + menuClasses.button],
    '&:hover': {
      ...baseMenuItemStyles['.' + menuClasses.button]['&:hover'],
      ...staticProxyItemHoverStyles['.' + menuClasses.button]['&:hover']
    }
  }
})

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  const pathname = usePathname()

  const params = useParams()

  const { lang: locale } = params

  // Vars
  const { isBreakpointReached, transitionDuration, isCollapsed, isHovered } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const isWalletVisible = !isCollapsed || isHovered

  const subMenuStyles = getSubMenuStyles()
  const staticProxyItemStyles = getStaticProxyItemStyles()

  const getMenuItemStyles = (path: string) => {
    const fullPath = `/${locale}/${path}`

    return pathname === fullPath ? { ...baseMenuItemStyles, ...activeMenuItemStyles } : baseMenuItemStyles
  }

  const isProxySubMenuActive = pathname.startsWith(`/${locale}/proxy`)

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Wallet Section */}
      <AnimatePresence>
        {isWalletVisible && (
          <motion.div
            initial={{ opacity: 0, maxHeight: 0 }} // Trạng thái ban đầu
            animate={{ opacity: 1, maxHeight: 300 }} // Trạng thái khi xuất hiện
            exit={{ opacity: 0, maxHeight: 0 }} // Trạng thái khi biến mất
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', padding: '0 1rem' }}
          >
            <div className='wallet-card'>
              <div className='wallet-header'>
                <Wallet className='wallet-icon' size={20} />
                <span className='wallet-title'>Ví của bạn</span>
              </div>
              <div className='wallet-balance'>
                <span className='balance-amount'>2,450,000</span>
                <span className='balance-currency'>VNĐ</span>
              </div>
              <div className='wallet-actions'>
                <button className='btn-primary'>
                  <Plus size={16} />
                  Nạp tiền
                </button>
                <button className='btn-secondary'>Rút tiền</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <CircleSmall size={10} /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuSection label='Trang chủ' rootStyles={menuSectionHeaderStyles}>
          <MenuItem
            icon={<ChartColumn />}
            rootStyles={getMenuItemStyles('overview')}
            component={<Link href='overview' />}
          >
            Tổng quan
          </MenuItem>

          <SubMenu label='Proxy' icon={<Globe />} rootStyles={subMenuStyles} defaultOpen={isProxySubMenuActive}>
            <MenuItem rootStyles={getMenuItemStyles('proxy-tinh')} component={<Link href='proxy-tinh' />}>
              Proxy tĩnh
            </MenuItem>
            <MenuItem rootStyles={getMenuItemStyles('proxy-xoay')} component={<Link href='proxy-xoay' />}>
              Proxy xoay
            </MenuItem>
          </SubMenu>

          {/* Check Proxy */}
          <MenuItem icon={<ShoppingBag />} rootStyles={getMenuItemStyles('check-proxy')} href='check-proxy'>
            Check Proxy
          </MenuItem>

          {/* Đơn hàng Proxy */}
          <MenuItem icon={<ReceiptText />} rootStyles={getMenuItemStyles('order-proxy')} href='order-proxy'>
            Đơn hàng Proxy
          </MenuItem>

          {/* Đơn hàng Proxy xoay */}
          <MenuItem icon={<PackagePlus />} rootStyles={baseMenuItemStyles}>
            Đơn hàng Proxy xoay
          </MenuItem>

          {/* Lịch sử mua hàng */}
          <MenuItem icon={<History />} rootStyles={baseMenuItemStyles}>
            Lịch sử mua hàng
          </MenuItem>

          {/* Lịch sử giao dịch */}
          <MenuItem icon={<FileText />} rootStyles={baseMenuItemStyles}>
            Lịch sử giao dịch
          </MenuItem>

          {/* Lịch sử đổi proxy */}
          <MenuItem icon={<History />} rootStyles={baseMenuItemStyles}>
            Lịch sử đổi proxy
          </MenuItem>

          {/* Hướng dẫn */}
          <MenuItem icon={<User />} rootStyles={baseMenuItemStyles}>
            Hướng dẫn
          </MenuItem>

          {/* Hỗ trợ */}
          <MenuItem icon={<MessageCircleQuestionMark />} rootStyles={baseMenuItemStyles}>
            Hỗ trợ
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
