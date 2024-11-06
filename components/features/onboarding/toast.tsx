'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function Toast(props: { restart: () => void }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="w-full fixed bottom-4 xs:bottom-12 mx-auto flex justify-center px-3 xl:max-w-screen-xl 2xl:max-w-screen-2xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="flex gap-2 p-1.5 border border-border rounded-full shadow-black shadow-sm bg-background-sh">
            <div className="flex gap-2">
              <Link href="/home">
                <Button variant="ghost" size="sm" className="rounded-full" aria-label="Open home page">
                  Back
                </Button>
              </Link>
              <Button onClick={props.restart} variant="tertiary" size="sm" className="rounded-full" aria-label="Reload onboarding demo">
                Reload
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}