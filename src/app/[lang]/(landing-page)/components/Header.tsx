import MainHeader from '@/app/[lang]/(landing-page)/components/MainHeader'

interface HeaderProps {
  serverLogo?: string
  serverName?: string
}

const Header = ({ serverLogo, serverName }: HeaderProps) => {
  return <MainHeader serverLogo={serverLogo} serverName={serverName} />
}

export default Header
