// THÊM MỚI: Import useState và useEffect từ React
import { useState, useEffect, type MouseEvent } from 'react'

import { useParams, usePathname } from 'next/navigation'

import {
  ChartColumn,
  Globe,
  CircleSmall,
  ShoppingBag,
  History,
  ReceiptText,
  PackagePlus,
  FileText,
  User,
  MessageCircleQuestionMark,
  Handshake,
  Link,

  // Admin icons
  Users,
  Settings,
  BarChart3,
  Shield,
  Database,
  CreditCard,
  Activity
} from 'lucide-react'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { menuClasses } from '@menu/utils/menuClasses'

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
import type { getDictionary } from '@/utils/getDictionary'
import BalanceCard from '@/app/[lang]/(private)/(client)/components/wallet/BalanceCard'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

// =================================================================
// Các hằng số và styles của bạn (giữ nguyên)
// =================================================================
const colors = {
  textDefault: '#4a5568',
  textHover: '#2d3748',
  textMuted: '#a0aec0',
  bgHover: '#f7fafc',
  iconHoverSpecial: '#FC4336',
  textActive: '#ffffff',
  bgActive: 'var(--primary-gradient)'
}

const fontSizes = {
  label: '14px',
  menuItem: '12px'
}

const menuSectionHeaderStyles = {
  fontSize: fontSizes.label,
  fontWeight: 600,
  color: colors.textMuted,
  padding: '0',
  marginBottom: '1rem'
}

const activeMenuItemStyles = {
  ['.' + menuClasses.button]: {
    background: `${colors.bgActive} !important`,
    color: `${colors.textActive} !important`,
    '&:hover': {
      background: `${colors.bgHover} !important`,
      color: `${colors.textActive} !important`
    }
  },
  ['.' + menuClasses.icon]: {
    color: `${colors.textActive} !important`
  }
}

const baseMenuItemStyles = {
  ['.' + menuClasses.button]: {
    width: '100%',
    color: `${colors.textDefault} !important`,
    fontSize: fontSizes.label,
    '&:hover': {
      background: `${colors.bgHover} !important`,
      color: `${colors.textHover} !important`
    }
  },
  ['.' + menuClasses.label]: {
    marginTop: '2px',
    display: 'inline'
  }
}

const activeSubMenuStyles = {
  ['&.' + menuClasses.open + ' > .' + menuClasses.button]: {
    color: colors.textActive,
    fontSizes: fontSizes.menuItem
  }
}

const getSubMenuStyles = () => ({
  ...baseMenuItemStyles,
  ...activeSubMenuStyles,
  ['.' + menuClasses.label]: {
    ...baseMenuItemStyles['.' + menuClasses.label],
    fontSize: fontSizes.label
  }
})

// =================================================================
// Bắt đầu Component
// =================================================================
const VerticalMenu = ({ scrollMenu, dictionary }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const pathname = usePathname()
  const params = useParams()
  const { lang: locale } = params

  // THÊM MỚI: State và Effect để kiểm soát hiệu ứng lần đầu
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    // Sau khi component mount xong, đặt lại cờ để các animation sau này hoạt động
    setIsInitialLoad(false)
  }, []) // Mảng rỗng đảm bảo effect chỉ chạy một lần

  // Admin state - tạm thời set false, có thể cần logic kiểm tra quyền admin
  const [isAdminLoading, setIsAdminLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const isAdminSubMenuActive = true // Luôn mở submenu admin

  // Vars
  const { isBreakpointReached, transitionDuration, isCollapsed, isHovered } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar
  const isWalletVisible = !isCollapsed || isHovered

  // Styles functions (giữ nguyên)
  const subMenuStyles = getSubMenuStyles()

  const getMenuItemStyles = (path: string) => {
    const fullPath = `/${locale}/${path}`

    return pathname === fullPath ? { ...baseMenuItemStyles, ...activeMenuItemStyles } : baseMenuItemStyles
  }

  const isProxySubMenuActive = true // Luôn mở submenu DỊCH VỤ proxy

  return (
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
      <BalanceCard isInitialLoad={isInitialLoad} isWalletVisible={isWalletVisible} />

      {/* Vertical Menu (giữ nguyên) */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <CircleSmall size={10} /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuSection label='Trang chủ' rootStyles={menuSectionHeaderStyles}>
          <MenuItem
            icon={<ChartColumn size={20} strokeWidth={1.5} />}
            rootStyles={getMenuItemStyles('overview')}
            href={`/${locale}/overview`}
          >
            {dictionary['navigation'].overview}
          </MenuItem>
        </MenuSection>

        <MenuSection label='Dịch vụ' rootStyles={menuSectionHeaderStyles}>
          <SubMenu
            label={dictionary['navigation'].proxy}
            icon={<Globe size={20} strokeWidth={1.5} />}
            rootStyles={subMenuStyles}
            defaultOpen={isProxySubMenuActive}
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              // Ngăn chặn việc đóng submenu khi click
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <MenuItem rootStyles={getMenuItemStyles('proxy-tinh')} href={`/${locale}/proxy-tinh`}>
              {dictionary['navigation'].staticProxy}
            </MenuItem>
            <MenuItem rootStyles={getMenuItemStyles('proxy-xoay')} href={`/${locale}/proxy-xoay`}>
              {dictionary['navigation'].rotatingProxy}
            </MenuItem>
          </SubMenu>

          {/* Các MenuItem khác giữ nguyên */}
          <MenuItem
            icon={<ShoppingBag size={20} strokeWidth={1.5} />}
            rootStyles={getMenuItemStyles('check-proxy')}
            href={`/${locale}/check-proxy`}
          >
            {dictionary['navigation'].checkProxy}
          </MenuItem>
          <MenuItem
            icon={<History size={20} strokeWidth={1.5} />}
            rootStyles={getMenuItemStyles('history-order')}
            href={`/${locale}/history-order`}
          >
            {dictionary['navigation'].purchaseHistory}
          </MenuItem>

          <MenuItem
            icon={<Link size={20} strokeWidth={1.5} />}
            rootStyles={getMenuItemStyles('affiliate')}
            href={`/${locale}/affiliate`}
          >
            {dictionary['navigation'].affiliate}
          </MenuItem>

          <MenuItem
            icon={<Handshake size={20} strokeWidth={1.5} />}
            rootStyles={getMenuItemStyles('partner')}
            href={`/${locale}/partner`}
          >
            {dictionary['navigation'].partner}
          </MenuItem>

          <MenuItem
            icon={<FileText size={20} strokeWidth={1.5} />}
            rootStyles={getMenuItemStyles('transaction-history')}
            href={`/${locale}/transaction-history`}
          >
            {dictionary['navigation'].transactionHistory}
          </MenuItem>

          <MenuItem
            icon={<FileText size={20} strokeWidth={1.5} />}
            rootStyles={getMenuItemStyles('docs')}
            href={`/${locale}/docs`}
            target='_blank'
          >
            {dictionary['navigation'].docsApi || 'API Docs'}
          </MenuItem>
        </MenuSection>

        <MenuSection label='Liên hệ' rootStyles={menuSectionHeaderStyles}>
          <MenuItem icon={<User size={20} strokeWidth={1.5} />} rootStyles={baseMenuItemStyles}>
            {dictionary['navigation'].guide}
          </MenuItem>
          <MenuItem icon={<MessageCircleQuestionMark size={20} strokeWidth={1.5} />} rootStyles={baseMenuItemStyles}>
            {dictionary['navigation'].support}
          </MenuItem>
        </MenuSection>


        {/* Admin Menu Section - Chỉ hiển thị khi user có quyền admin */}
        {!isAdminLoading && isAdmin && (
          <MenuSection label='Quản trị' rootStyles={menuSectionHeaderStyles}>
            <MenuItem
              icon={<BarChart3 size={20} strokeWidth={1.5} />}
              rootStyles={getMenuItemStyles('admin/dashboard')}
              href={`/${locale}/admin/dashboard`}
            >
              Dashboard Admin
            </MenuItem>

            <SubMenu
              label='Quản lý User'
              icon={<Users size={20} strokeWidth={1.5} />}
              rootStyles={subMenuStyles}
              defaultOpen={isAdminSubMenuActive && pathname.includes('/admin/users')}
            >
              <MenuItem rootStyles={getMenuItemStyles('admin/users/list')} href={`/${locale}/admin/users/list`}>
                Danh sách User
              </MenuItem>
              <MenuItem rootStyles={getMenuItemStyles('admin/users/create')} href={`/${locale}/admin/users/create`}>
                Thêm User mới
              </MenuItem>
              <MenuItem
                rootStyles={getMenuItemStyles('admin/users/permissions')}
                href={`/${locale}/admin/users/permissions`}
              >
                Phân quyền User
              </MenuItem>
            </SubMenu>

            <SubMenu
              label='Quản lý Proxy'
              icon={<Globe size={20} strokeWidth={1.5} />}
              rootStyles={subMenuStyles}
              defaultOpen={isAdminSubMenuActive && pathname.includes('/admin/proxy')}
            >
              <MenuItem rootStyles={getMenuItemStyles('admin/proxy')} href={`/${locale}/admin/proxy`}>
                Danh sách Proxy
              </MenuItem>
              <MenuItem rootStyles={getMenuItemStyles('admin/proxy/create')} href={`/${locale}/admin/proxy/create`}>
                Thêm Proxy mới
              </MenuItem>
              <MenuItem rootStyles={getMenuItemStyles('admin/proxy/config')} href={`/${locale}/admin/proxy/config`}>
                Cấu hình Proxy
              </MenuItem>
            </SubMenu>

            <SubMenu
              label='Quản lý Đối tác'
              icon={<CreditCard size={20} strokeWidth={1.5} />}
              rootStyles={subMenuStyles}
              defaultOpen={isAdminSubMenuActive && pathname.includes('/admin/partner')}
            >
              <MenuItem rootStyles={getMenuItemStyles('admin/partner')} href={`/${locale}/admin/partner`}>
                Danh sách đối tác
              </MenuItem>
              <MenuItem rootStyles={getMenuItemStyles('admin/orders/pending')} href={`/${locale}/admin/orders/pending`}>
                Đơn hàng chờ xử lý
              </MenuItem>
              <MenuItem
                rootStyles={getMenuItemStyles('admin/orders/transactions')}
                href={`/${locale}/admin/orders/transactions`}
              >
                Lịch sử giao dịch
              </MenuItem>
            </SubMenu>

            <SubMenu
              label='Quản lý Đơn hàng'
              icon={<CreditCard size={20} strokeWidth={1.5} />}
              rootStyles={subMenuStyles}
              defaultOpen={isAdminSubMenuActive && pathname.includes('/admin/orders')}
            >
              <MenuItem rootStyles={getMenuItemStyles('admin/orders/all')} href={`/${locale}/admin/orders/all`}>
                Tất cả đơn hàng
              </MenuItem>
              <MenuItem rootStyles={getMenuItemStyles('admin/orders/pending')} href={`/${locale}/admin/orders/pending`}>
                Đơn hàng chờ xử lý
              </MenuItem>
              <MenuItem
                rootStyles={getMenuItemStyles('admin/orders/transactions')}
                href={`/${locale}/admin/orders/transactions`}
              >
                Lịch sử giao dịch
              </MenuItem>
            </SubMenu>

            <SubMenu
              label='Báo cáo & Thống kê'
              icon={<Activity size={20} strokeWidth={1.5} />}
              rootStyles={subMenuStyles}
              defaultOpen={isAdminSubMenuActive && pathname.includes('/admin/reports')}
            >
              <MenuItem
                rootStyles={getMenuItemStyles('admin/reports/revenue')}
                href={`/${locale}/admin/reports/revenue`}
              >
                Báo cáo doanh thu
              </MenuItem>
              <MenuItem rootStyles={getMenuItemStyles('admin/reports/users')} href={`/${locale}/admin/reports/users`}>
                Thống kê user
              </MenuItem>
              <MenuItem rootStyles={getMenuItemStyles('admin/reports/proxy')} href={`/${locale}/admin/reports/proxy`}>
                Thống kê proxy
              </MenuItem>
            </SubMenu>

            <SubMenu
              label='Hệ thống'
              icon={<Database size={20} strokeWidth={1.5} />}
              rootStyles={subMenuStyles}
              defaultOpen={isAdminSubMenuActive && pathname.includes('/admin/system')}
            >
              <MenuItem rootStyles={getMenuItemStyles('admin/system/config')} href={`/${locale}/admin/system/config`}>
                Cấu hình hệ thống
              </MenuItem>
              <MenuItem rootStyles={getMenuItemStyles('admin/system/backup')} href={`/${locale}/admin/system/backup`}>
                Backup dữ liệu
              </MenuItem>
              <MenuItem rootStyles={getMenuItemStyles('admin/system/logs')} href={`/${locale}/admin/system/logs`}>
                Logs hệ thống
              </MenuItem>
            </SubMenu>

            <SubMenu
              label='Bảo mật'
              icon={<Shield size={20} strokeWidth={1.5} />}
              rootStyles={subMenuStyles}
              defaultOpen={isAdminSubMenuActive && pathname.includes('/admin/security')}
            >
              <MenuItem
                rootStyles={getMenuItemStyles('admin/security/api-keys')}
                href={`/${locale}/admin/security/api-keys`}
              >
                Quản lý API Keys
              </MenuItem>
              <MenuItem rootStyles={getMenuItemStyles('admin/security/audit')} href={`/${locale}/admin/security/audit`}>
                Audit Logs
              </MenuItem>
              <MenuItem
                rootStyles={getMenuItemStyles('admin/security/settings')}
                href={`/${locale}/admin/security/settings`}
              >
                Cài đặt bảo mật
              </MenuItem>
            </SubMenu>

            <MenuItem
              icon={<Settings size={20} strokeWidth={1.5} />}
              rootStyles={getMenuItemStyles('admin/settings')}
              href={`/${locale}/admin/settings`}
            >
              Cài đặt
            </MenuItem>
          </MenuSection>
        )}

      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
