import { ActionsScheduling } from "@/components/features/scheduling/actions-scheduling";

export default async function SchedulingLayout(props: { children: React.ReactNode}) {
  return (
    <div className="w-full max-h-[100vh] pl-3 pr-2 xs:pl-6 xs:pr-5 xs:border-x-[1px] border-border overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-track-card-background scrollbar-w-1 scrollbar-h-1">
      {props.children}
      <ActionsScheduling />
    </div>
  )
}