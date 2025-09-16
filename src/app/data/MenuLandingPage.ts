// src/data/menus/landing-page/MenuLandingPage.ts
import { useTranslation } from 'react-i18next'

const useMenuLandingPage = () => {
  const { t } = useTranslation()
  
  return [
    {
      label: t('landing.header.menu.home'),
      href: '',
      icon: 'tabler-smart-home'
    },
    {
      label: t('landing.header.menu.about'),
      href: '/about',
      icon: 'tabler-info-circle'
    },
    {
      label: t('landing.header.menu.cooperate'),
      href: '/cooperate',
      icon: 'tabler-info-circle'
    },
    {
      label: t('landing.header.menu.products'),
      href: '/overview',
      icon: 'tabler-info-circle',
      target: '_blank'
    },
    {
      label: t('landing.header.menu.hotline'),
      href: '/hotline',
      icon: 'tabler-info-circle'
    }
  ]
}

export default useMenuLandingPage
