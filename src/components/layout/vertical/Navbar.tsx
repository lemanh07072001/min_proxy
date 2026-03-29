// Third-party Imports
import { getServerSession } from 'next-auth/next'

// Component Imports
import LayoutNavbar from '@layouts/components/vertical/Navbar'
import NavbarContent from './NavbarContent'


const Navbar = async () => {

  return (
    <LayoutNavbar>
      <NavbarContent  />
    </LayoutNavbar>
  )
}

export default Navbar
