'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { House } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { NextPrevFeatures } from "@/components/features/next-prev-features"
import { Button } from "@/components/ui/button"

export function ActionsTables() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className='w-full fixed top-4 xs:-top-20 mx-auto flex justify-center px-3 xl:max-w-screen-xl 2xl:max-w-screen-2xl'
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className='flex items-center gap-2 p-1.5 border border-border rounded-full shadow-black shadow-sm bg-background-sh'>
            <Link href='/home'>
              <Button variant='outline' size='icon' className='rounded-full' aria-label='Go to home page'>
                <House size={18} />
              </Button>
            </Link>
            <NextPrevFeatures />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}