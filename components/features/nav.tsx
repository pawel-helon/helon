import Link from "next/link";
import { House } from "lucide-react";
import { NextPrevFeatures } from "./next-prev-features";
import { Button } from "@/components/ui/button";


export function Nav() {
  return (
    <div className='flex items-center gap-2 p-1.5 border border-border rounded-full shadow-black shadow-sm bg-background-sh'>
      <Link href='/home'>
        <Button variant='outline' size='icon' className='rounded-full' aria-label='Go to home page'>
          <House size={18}/>
        </Button>
      </Link>
      <NextPrevFeatures />
    </div>
  )
}