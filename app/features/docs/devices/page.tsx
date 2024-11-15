"use client"

import { useRouter } from "next/navigation";

export default function DocsDevicesPage() {
  const router = useRouter();
  router.push("/features/docs/devices/adding-new-device");
}