import { getUsers } from "@/actions/server-actions";
import { columns } from "@/components/features/tables/data-table/column-definitions";
import { Table } from "@/components/features/tables/table";
import { User } from "@prisma/client";

export default async function TablesPage() {
  const gettingUsers = await getUsers();
  const data = gettingUsers.users as User[];
  return <Table data={data} columns={columns}/>
}