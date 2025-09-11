// Third-party Imports
import { getServerSession } from 'next-auth'

// Component Imports
import LayoutNavbar from '@layouts/components/vertical/Navbar'
import NavbarContent from './NavbarContent'


const Navbar = async () => {

  return (
    <LayoutNavbar>
      {/* Truyền dữ liệu user xuống Client Component nếu cần */}
      <NavbarContent  />
    </LayoutNavbar>
  )
}

export default Navbar
