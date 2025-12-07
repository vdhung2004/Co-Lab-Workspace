"use client";
import {
  GenericDataTable,
  Column,
  Action,
} from "@/components/admin/GenericDataTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

const roles = ["Admin", "User", "Moderator"];

export default function UsersTable() {
  const [users, setUsers] = useState(
    Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@test.com`,
      role: roles[i % 3],
    }))
  );

  const [filterName, setFilterName] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const columns: Column<(typeof users)[0]>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
  ];

  const actions: Action<(typeof users)[0]>[] = [
    { label: "Edit", onClick: (row) => alert(`Edit ${row.name}`) },
    { label: "Delete", onClick: (row) => alert(`Delete ${row.name}`) },
  ];

  const filters = (
    <div className="flex gap-2 ">
      <Input
        placeholder="Search by name"
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
      />
      <Select value={filterRole} onValueChange={(val) => setFilterRole(val)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {roles.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(filterName.toLowerCase()) &&
      (filterRole === "all" ? true : u.role === filterRole)
  );

  return (
    <GenericDataTable
      data={filteredUsers}
      columns={columns}
      actions={actions}
      filters={filters}
      pageSize={10}
    />
  );
}
