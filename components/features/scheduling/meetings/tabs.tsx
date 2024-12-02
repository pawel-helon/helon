import Link from "next/link";

export function Tabs() {
  return (
    <ul role="tablist" className="h-11 mb-8 flex border-b border-border">
      <li role="tab" className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-3 py-1 text-sm font-medium hover:cursor-pointer ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 text-primary shadow border-b border-primary">
        <Link href="/features/scheduling/meetings" prefetch={true}>
          Meetings
        </Link>
      </li>
      <li role="tab" className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-3 py-1 text-sm font-medium hover:cursor-pointer ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 text-muted-foreground shadow border-b border-muted-foreground">
        <Link href="/features/scheduling/availability" prefetch={true}>
          Availability
        </Link>
      </li>
    </ul>
  )
}