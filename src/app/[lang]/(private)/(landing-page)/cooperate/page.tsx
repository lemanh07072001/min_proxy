import Services from '../components/cooperate/Services'
import Hero from '../components/cooperate/Hero'
import Agency from '../components/cooperate/Agency'
import About from '../components/cooperate/About'

export default function CooperatePage() {
  return (
    <div className='min-h-screen relative'>
      <div className='relative'>
        <Services />
        <Agency />
        <About />
      </div>
    </div>
  )
}
