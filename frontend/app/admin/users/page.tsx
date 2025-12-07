"use client";

import { useState } from "react";
import {
  Column,
  Action,
  GenericDataTable,
} from "@/components/admin/GenericDataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Mock User data matching Prisma User schema
 * TODO: Replace with API call to GET /api/users
 * Example: const response = await fetch('/api/users?limit=100')
 */
type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
  status: "active" | "locked";
  verified: boolean;
  createdAt: Date;
};

const mockUsers: User[] = [
  {
    id: "user-1",
    fullName: "Nguyễn Văn A",
    email: "admin@example.com",
    phone: "0901234567",
    role: "admin",
    status: "active",
    verified: true,
    createdAt: new Date("2025-12-01T10:00:00Z"),
  },
  {
    id: "user-2",
    fullName: "Trần Thị B",
    email: "customer1@example.com",
    phone: "0912345678",
    role: "customer",
    status: "active",
    verified: true,
    createdAt: new Date("2025-12-02T12:00:00Z"),
  },
  {
    id: "user-3",
    fullName: "Phạm Văn C",
    email: "customer2@example.com",
    phone: "0923456789",
    role: "customer",
    status: "locked",
    verified: false,
    createdAt: new Date("2025-12-03T14:00:00Z"),
  },
];

export default function UsersPage() {
  // State management for future API integration
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "customer">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "locked">(
    "all"
  );

  // Filtered data
  const filteredUsers = users.filter((user) => {
    const roleMatch = roleFilter === "all" || user.role === roleFilter;
    const statusMatch = statusFilter === "all" || user.status === statusFilter;
    return roleMatch && statusMatch;
  });

  // Column configuration
  const columns: Column<User>[] = [
    {
      key: "fullName",
      label: "Full Name",
      sortable: true,
      width: "w-40",
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      width: "w-48",
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (user) => (
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (user) => (
        <Badge variant={user.status === "active" ? "default" : "destructive"}>
          {user.status}
        </Badge>
      ),
    },
    {
      key: "verified",
      label: "Verified",
      render: (user) => (
        <Badge variant={user.verified ? "default" : "secondary"}>
          {user.verified ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (user) => user.createdAt.toLocaleDateString("vi-VN"),
    },
  ];

  // Row actions
  const actions: Action<User>[] = [
    {
      label: "View Profile",
      onClick: (user) => {
        // TODO: Implement user details modal
        // GET /api/users/{id}
        const details = `User: ${user.fullName}\nEmail: ${user.email}\nPhone: ${
          user.phone
        }\nRole: ${user.role}\nStatus: ${user.status}\nVerified: ${
          user.verified ? "Yes" : "No"
        }`;
        alert(details);
      },
    },
    {
      label: "Edit",
      onClick: (user) => {
        // TODO: Implement edit modal with form
        // PATCH /api/users/{id} with updated data
        alert(`Edit user: ${user.fullName}`);
      },
    },
    {
      label: "Toggle Status",
      onClick: (user) => {
        // TODO: Toggle user status (active <-> locked)
        // PATCH /api/users/{id}/status
        const newStatus = user.status === "active" ? "locked" : "active";
        if (confirm(`Change status to ${newStatus} for ${user.fullName}?`)) {
          alert(`Updated ${user.fullName} status to: ${newStatus}`);
        }
      },
    },
    {
      label: "Delete",
      onClick: (user) => {
        // TODO: Implement delete confirmation modal
        // DELETE /api/users/{id}
        if (
          confirm(`Delete user ${user.fullName}? This action cannot be undone.`)
        ) {
          alert(`Deleted user: ${user.fullName}`);
        }
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage system users and their permissions
          </p>
        </div>
        <Button>
          {/* TODO: Add new user modal - POST /api/users */}
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Role:</label>
          <Select
            value={roleFilter}
            onValueChange={(value) =>
              setRoleFilter(value as "all" | "admin" | "customer")
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Status:</label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as "all" | "active" | "locked")
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="text-sm text-muted-foreground ml-auto">
          {filteredUsers.length} result{filteredUsers.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Data Table */}
      <GenericDataTable
        data={filteredUsers}
        columns={columns}
        actions={actions}
        loading={loading}
        pageSize={10}
        searchableFields={["fullName", "email"]}
      />
    </div>
  );
}
