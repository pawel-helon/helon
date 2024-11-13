"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { IoIosInformationCircle } from "react-icons/io";
import { Text } from "@/components/typography";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function DevicesByStatusChart(props: {
  allDevicesCount: number;
  activeDevicesCount: number;
}) {
  const inactiveDevicesCount = props.allDevicesCount - props.activeDevicesCount;
  const chartData = React.useMemo(() => [
    { status: "active", devices: props.activeDevicesCount, fill: "var(--color-active)" },
    { status: "inactive", devices: inactiveDevicesCount, fill: "var(--color-inactive)" },
  ], [props.activeDevicesCount, inactiveDevicesCount]);
    
  const allDevicesCount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.devices, 0);
  }, [chartData]);
    
  return (
    <div className="h-min col-span-2 p-3 border border-border rounded-lg bg-background shadow-black shadow-2xl">
      <div className="flex gap-1 items-start">
        <Text variant="h3">Status</Text>
        <Popover>
          <PopoverTrigger>
            <IoIosInformationCircle size={16} className="text-muted-foreground"/>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-fit z-100 rounded-md px-3 py-1.5 text-xs text-primary-foregroundbg-background-sh border border-border shadow-black shadow-md bg-background">
            <Text variant="p-small-thin">
              Devices grouped by status
            </Text>
          </PopoverContent>
        </Popover>
      </div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Pie
            data={chartData}
            dataKey="devices"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground-h text-3xl font-bold"
                      >
                        {allDevicesCount.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Devices
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}

const chartConfig = {
  devices: {
    label: "Devices",
  },
  active: {
    label: "Active",
    color: "hsl(var(--chart-primary))",
  },
  inactive: {
    label: "Inactive",
    color: "hsl(var(--chart-secondary))",
  },
} satisfies ChartConfig;
