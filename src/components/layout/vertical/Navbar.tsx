// Third-party Imports
import { getServerSession } from 'next-auth'

// Component Imports
import LayoutNavbar from '@layouts/components/vertical/Navbar'
import NavbarContent from './NavbarContent'

// Lib Imports
import { authOptions } from '@/libs/auth'

const Navbar = async () => {


  return (
    <LayoutNavbar>
      <NavbarContent />
    </LayoutNavbar>
  )
}

export default Navbar
