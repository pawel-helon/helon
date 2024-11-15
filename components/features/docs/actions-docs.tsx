'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { House } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { NextPrevFeatures } from "@/components/features/next-prev-features"
import { ToggleRole } from "./toggle-role"
import { Button } from "@/components/ui/button"
import { ROLE } from "@prisma/client"
import { getRole } from "@/actions/database-actions"

export function ActionsDocs() {
  const [role, setRole] = useState<ROLE | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const gettingRole = await getRole();
        if (gettingRole.role) {
          setRole(gettingRole.role);
        }
      } catch (error) {
        console.error(error)
      }
    }
    init();
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [setRole])
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className='w-full fixed bottom-4 xs:bottom-12 mx-auto flex justify-center px-3 xl:max-w-screen-xl 2xl:max-w-screen-2xl'
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className='flex flex-col xs:flex-row items-center gap-3'>
            <div className='flex items-center gap-2 p-1.5 border border-border rounded-full shadow-black shadow-sm bg-background-sh'>
              <Link href='/home'>
                <Button variant='outline' size='icon' className='rounded-full' aria-label='Go to home page'>
                  <House size={18}/>
                </Button>
              </Link>
              <NextPrevFeatures />
            </div>
            <ToggleRole role={role as ROLE} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}