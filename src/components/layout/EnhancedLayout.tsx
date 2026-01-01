import React, { useState, useEffect } from 'react'
import EnhancedHeader from './EnhancedHeader'
import Footer from './Footer'
import ParticlesBackground from '../ui/ParticlesBackground'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { Button } from '../ui/Button'

interface EnhancedLayoutProps {
  children: React.ReactNode
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({ children }) => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  // #9 Scroll Detection for FAB
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticlesBackground />
      <EnhancedHeader />
      <main className="flex-1 relative z-10">
        {children}
      </main>
      <Footer />

      {/* #9 Floating Action Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-white"
                onClick={scrollToTop}
              >
                <ArrowUp className="h-6 w-6" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EnhancedLayout