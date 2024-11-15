"use client"

import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { columns } from "./data-table/column-definitions";
import { getUsers } from "@/actions/database-actions";
import { DataTable } from "./data-table";

export function DataTableWrapper() {
  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    async function fetchData() {
      const gettingUsers = await getUsers();
      if (!gettingUsers.users) {
        return;
      } 
      setData(gettingUsers.users);
    }
    fetchData();
  },[setData])
  
  return <DataTable data={data} columns={columns}/>
}