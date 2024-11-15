'use client'

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { House } from "lucide-react"
import { getRole, updateRoleDocsFeature } from "@/actions/database-actions"
import { AnimatePresence, motion } from "framer-motion"
import { NextPrevFeatures } from "@/components/features/next-prev-features"
import { Button } from "@/components/ui/button"
import { ROLE } from "@prisma/client"

const ROLES = [ROLE.ENDUSER, ROLE.OWNER, ROLE.ADMIN];

export default function ActionsDocs() {
  const [isVisible, setIsVisible] = useState(false)
  const [role, setRole] = useState<ROLE>(ROLE.ENDUSER);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const initRole = async () => {
      const gettingRole = await getRole();
      if (!gettingRole.role) return;
      setRole(gettingRole.role);
    }
    initRole();
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [setRole])

  async function handleChangeRole(newRole: ROLE) {
    try {
      setRole(newRole);
      startTransition(async () => {
        const updatingRole = await updateRoleDocsFeature(newRole);
        if (updatingRole.status !== 200) {
          toast.error(updatingRole.message);
          setRole(role);
          return;
        }
        window.location.reload()
      })
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred. Try again later.')
      setRole(role);
    }
  }
  
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
            <div className='flex items-center gap-0.5 p-1.5 border border-border rounded-full shadow-black shadow-sm bg-background-sh'>
              {ROLES.map((r) => (
                <Button key={r} disabled={isPending} onClick={() => handleChangeRole(r)} size="sm" variant={r === role ? "tertiary" : "ghost"} className="rounded-full">
                  {r.toLowerCase()}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}