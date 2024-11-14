import { DotPattern } from "@/components/dot-pattern";
import { Text } from "@/components/typography";
import Image from "next/image";
import Link from "next/link";

export default async function HomeLayout(props: { children: React.ReactNode }) {
    return (
      <div className="w-full flex flex-col px-3 border-x-[1px] border-border overflow-y-scroll scrollbar scrollbar-thumb-border scrollbar-thumb-rounded-full scrollbar-track-card-background max-h-[100vh] scrollbar-w-1 scrollbar-h-1">
        <div className="fixed xs:sticky z-50 top-0 left-3 right-3 xs:w-full flex justify-start items-center pt-4 pb-2 bg-background-sh">
          <Link href="/home">
            <Image src="/logotype.png" alt="logo" width={45} height={12} />
          </Link>
        </div>
        <div>
          {props.children}
        </div>
        <div className="flex justify-end py-4 border-t border-border">
          <Text variant="p-small-thin">
            © 2024
          </Text>
        </div>
        <DotPattern />
      </div>
    );
}
