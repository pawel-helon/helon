"use client";

import { useMedia } from "react-use";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { IoIosInformationCircle } from "react-icons/io";
import { Text } from "@/components/typography";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
export function NewDevicesChart(props: { data: { month: string; count: number }[] }) {
  const isMobile = useMedia('(max-width: 480px)', false)
  return (
    <div className="z-40 col-span-3 border border-border rounded-lg bg-background shadow-black shadow-2xl">
      <div className="flex p-3 gap-1 items-start">
        <Text variant="h3">New</Text>
        <Popover>
          <PopoverTrigger>
            <IoIosInformationCircle size={16} className="text-muted-foreground"/>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-fit z-100 rounded-md px-3 py-1.5 text-xs text-primary-foregroundbg-background border border-border shadow-black shadow-md bg-background">
            <Text variant="p-small-thin">
              New devices each month
            </Text>
          </PopoverContent>
        </Popover>
      </div>
      <>
        {isMobile ? (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={props.data}
              layout="vertical"
              margin={{right: 16}}
              width={200}
              height={400}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="count"
                layout="vertical"
                fill="var(--color-new)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        ) : (
        <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
          <BarChart accessibilityLayer data={props.data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-new)" radius={4} />
          </BarChart>
        </ChartContainer>
        )}
      </>
    </div>
  );
}

const chartConfig = {
  new: {
    label: "New",
    color: "hsl(var(--chart-primary))",
  },
  label: {
    color: "hsl(var(--foreground))",
  }
} satisfies ChartConfig;
