'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent} from '@/components/ui/dropdown-menu'
import { ROLE } from '@prisma/client'

const ROLES = [ROLE.ADMIN, ROLE.OWNER, ROLE.ENDUSER]

export function Toast(props: { role: ROLE }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

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
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2 p-1.5 border border-border rounded-full shadow-black shadow-sm bg-background-sh'>
              <Link href='/home'>
                <Button variant='ghost' size='sm' className='rounded-full' aria-label='Open home page'>
                  Home
                </Button>
              </Link>
              <div className='flex gap-1'>
                <Link href='/features/notifications'>
                  <Button size='icon' variant='outline' className='rounded-full'>
                    <ChevronLeft size={18} />
                  </Button>
                </Link>
                <Link href='/features/auth'>
                  <Button size='icon' variant='outline' className='rounded-full'>
                    <ChevronRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='tertiary' size='sm' className='w-22 rounded-full' aria-label='Switch user role'>
                  {props.role.toLowerCase()}
                  <ChevronDown className='ml-2 -mr-1 size-4'/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='min-w-22 flex flex-col'>
                {ROLES.filter((role) => role !== props.role).map((role) => (
                  <button key={role} className='h-8 text-xs text-left px-1.5 py-2 rounded-md hover:bg-accent hover:text-accent-foreground'>
                    {role.toLowerCase()}
                  </button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}