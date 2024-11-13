import { IoIosInformationCircle } from "react-icons/io";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export function DisabledAction(props: {
  children?: React.ReactNode,
  side?: "top" | "right" | "bottom" | "left",
  sideOffset?: number,
  align?: "start" | "center" | "end",
  alignOffset?: number
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {props.children}
      </PopoverTrigger>
      <PopoverContent
        side={props.side}
        sideOffset={props.sideOffset}
        align={props.align}
        alignOffset={props.alignOffset}
        className="w-fit flex items-center gap-2 text-xs bg-background-sh p-2 pr-4"
      >
        <IoIosInformationCircle size={18} />
        This action has been disabled
      </PopoverContent>
    </Popover>
  )
}