import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function SchedulingLayout(props: { children: React.ReactNode}) {
  return (
    <div className="relative w-full max-h-[100vh] pl-3 pr-2 xs:pl-6 xs:pr-5 xs:border-x-[1px] border-border overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
      {props.children}
      <div className="w-full fixed bottom-3 left-0 right-0 mx-auto flex justify-end px-3 xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <Link href="/home">
          <Button size="lg" className="pl-2 pr-4 shadow-black shadow-xl">
            <ChevronLeft className="size-5 mr-1"/>
            Back
          </Button>
        </Link>
      </div>
    </div>
  )
}