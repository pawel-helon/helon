import Link from "next/link";
import { Text } from "@/components/typography";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  return (
    <div>
      <div className="relative h-[80vh] justify-center items-center flex flex-col gap-8">
        <Text variant="h1" className="text-5xl xs:text-6xl">Web apps</Text>
        <Text variant="p-base-thin">
          Fully responsive web apps built with{" "}
          <span className="text-white">Next.js</span>
        </Text>
        <Link href="/book-meeting" prefetch={true}>
          <Button size="lg">Book meeting</Button>
        </Link>
        <span className="absolute top-[5%] right-[10%] animate-scale-160 rounded-full size-1.5 bg-accent-pink-h" />
        <span className="absolute top-[57%] xs:top-[40%] left-[5%] xs:left-[20%] animate-scale-140 rounded-full size-3 bg-accent-orange-h" />
        <span className="absolute bottom-[10%] right-[30%] animate-scale rounded-full size-5 bg-accent-yellow-h" />
      </div>
    </div>
  );
}
