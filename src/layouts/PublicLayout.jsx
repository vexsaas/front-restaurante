import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SmoothScroll from '../motion/SmoothScroll'

export default function PublicLayout() {
  const { pathname } = useLocation()

  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-fondo">
        <Navbar />
        {/* La key reinicia la entrada en cada cambio de ruta. */}
        <motion.main
          key={pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.main>
        <Footer />
      </div>
    </SmoothScroll>
  )
}
