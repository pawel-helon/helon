import { redirect } from "next/navigation";

export default async function DocsDevicesPage() {
  redirect("/features/docs/devices/adding-new-device");
}