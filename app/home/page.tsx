import Link from "next/link";
import { Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/home/card";

export default async function HomePage() {
  return (
    <div className="mb-16">
      <div className="relative h-[80vh] justify-center items-center flex flex-col gap-8">
        <Text variant="h1" className="text-5xl xs:text-6xl">Web apps</Text>
        <Text variant="p-base-thin">
          Fully responsive web apps built with{" "}
          <span className="text-white">Next.js</span>
        </Text>
        <Link href="/book-meeting" prefetch={true}>
          <Button size="lg" variant="tertiary" className="rounded-full">Book meeting</Button>
        </Link>
        <span className="absolute top-[5%] right-[10%] animate-scale-160 rounded-full size-1 bg-accent-pink-h" />
        <span className="absolute top-[57%] xs:top-[40%] left-[5%] xs:left-[20%] animate-scale-140 rounded-full size-3  bg-gradient-to-r from-accent-orange-h to-accent-pink-h" />
        <span className="absolute bottom-[10%] right-[30%] animate-scale rounded-full size-5 bg-gradient-to-r from-accent-yellow-h to-accent-orange-h"/>
      </div>
      <div className="flex flex-col xs:grid grid-cols-2 grid-rows-4 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card
          title="Auth"
          link="/features/auth"
          overview={[""]}
          imageSrc="/temp.png"
        />
        <Card
          title="Forms"
          link="/features/forms"
          overview={["multiple steps", "prefilling data", "client side validation", "server side validation"]}
          imageSrc="/forms.png"
        />
        <Card
          title="Tables"
          link="/features/tables"
          overview={["filtering", "sorting", "pagination", "actions on rows", "exporting CSV"]}
          imageSrc="/tables.png"
        />
        <Card
          title="Charts"
          link="/features/charts"
          overview={[""]}
          imageSrc="/temp.png"
        />
        <Card
          title="QR codes"
          link="/features/qr-codes"
          overview={["one qr code for various cases (e.g. multiple user roles)"]}
          imageSrc="/qr-codes.png"
        />
        <Card
          title="Onboarding"
          link="/features/onboarding"
          overview={["separate flow for each user role"]}
          imageSrc="/onboarding.png"
        />
        <Card
          title="Scheduling"
          link="/features/scheduling"
          overview={["quickly setup your availability", "easily manage appointments", "get confirmations to your inbox"]}
          imageSrc="/scheduling.png"
        />
        <Card
          title="Notifications"
          link="/features/notifications"
          overview={[""]}
          imageSrc="/temp.png"
        />
        <Card
          title="Docs"
          link="/features/docs"
          overview={["separate docs for each user role"]}
          imageSrc="/docs.png"
        />
      </div>
    </div>
  );
}
