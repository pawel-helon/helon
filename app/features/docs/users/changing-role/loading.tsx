import { RiLoaderFill } from "react-icons/ri";

export default async function LoadingPage() {
  return (
    <div className="animate-fade-in transition-all duration-300 h-40 col-span-3 flex flex-col justify-center items-center gap-6 p-4 text-muted-foreground border border-border rounded-lg bg-background shadow-black shadow-2xl">
      <RiLoaderFill className="size-6 animate-spin" />
    </div>
  );
}
