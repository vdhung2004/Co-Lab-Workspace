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
 * Mock Workspace data matching Prisma Workspace schema
 * TODO: Replace with API call to GET /api/workspaces
 * Example: const response = await fetch('/api/workspaces?limit=100')
 */
type Workspace = {
  id: string;
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  status: "active" | "inactive";
  floorCount: number; // Computed from Floor relation
  createdAt: Date;
};

const mockWorkspaces: Workspace[] = [
  {
    id: "workspace-1",
    name: "CoLab Downtown",
    address: "123 Main Street, HCM City",
    description: "Premium co-working space in downtown area",
    latitude: 10.7769,
    longitude: 106.7009,
    status: "active",
    floorCount: 3, // 3 floors: Floor 1 (12 spaces), Floor 2 (15 spaces), Floor 3 (10 spaces)
    createdAt: new Date("2025-11-15T08:00:00Z"),
  },
  {
    id: "workspace-2",
    name: "CoLab Tech Hub",
    address: "456 Tech Park Avenue, HCM City",
    description: "High-tech workspace for startups",
    latitude: 10.8048,
    longitude: 106.7519,
    status: "active",
    floorCount: 2, // 2 floors: Floor 1 (18 spaces), Floor 2 (14 spaces)
    createdAt: new Date("2025-10-20T10:30:00Z"),
  },
  {
    id: "workspace-3",
    name: "CoLab Binh Thanh",
    address: "789 Vo Van Ngo Street, HCM City",
    description: "Mid-size office space",
    latitude: 10.8127,
    longitude: 106.7147,
    status: "active",
    floorCount: 2, // 2 floors: Floor 1 (8 spaces), Floor 2 (6 spaces)
    createdAt: new Date("2025-09-10T14:15:00Z"),
  },
];

export default function WorkspacesPage() {
  // State management for future API integration
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Filter workspaces based on status
  const filteredWorkspaces = workspaces.filter((ws) => {
    if (statusFilter === "all") return true;
    return ws.status === statusFilter;
  });

  // Column configuration
  const columns: Column<Workspace>[] = [
    {
      key: "name",
      label: "Workspace Name",
      sortable: true,
      width: "w-40",
    },
    {
      key: "address",
      label: "Address",
      sortable: true,
      width: "w-56",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (ws) => (
        <Badge variant={ws.status === "active" ? "default" : "destructive"}>
          {ws.status}
        </Badge>
      ),
    },
    {
      key: "floorCount",
      label: "Floors",
      sortable: true,
      render: (ws) => <span className="font-medium">{ws.floorCount}</span>,
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (ws) => ws.createdAt.toLocaleDateString("vi-VN"),
    },
  ];

  // Row actions
  const actions: Action<Workspace>[] = [
    {
      label: "View Details",
      onClick: (ws) => {
        // TODO: Implement workspace details modal
        // GET /api/workspaces/{id}
        const details = `Workspace: ${ws.name}\nAddress: ${
          ws.address
        }\nDescription: ${ws.description}\nCoordinates: ${ws.latitude}, ${
          ws.longitude
        }\nStatus: ${ws.status}\nFloors: ${
          ws.floorCount
        }\nCreated: ${ws.createdAt.toLocaleDateString("vi-VN")}`;
        alert(details);
      },
    },
    {
      label: "Edit",
      onClick: (ws) => {
        // TODO: Implement edit modal with form
        // PATCH /api/workspaces/{id} with updated data
        alert(`Edit workspace: ${ws.name}`);
      },
    },
    {
      label: "View Floors",
      onClick: (ws) => {
        // TODO: Navigate to floors management page
        // GET /api/workspaces/{id}/floors
        alert(`View floors for: ${ws.name}`);
      },
    },
    {
      label: "View Spaces",
      onClick: (ws) => {
        // TODO: Navigate to all spaces for this workspace
        // GET /api/workspaces/{id}/spaces
        alert(`View all spaces in: ${ws.name}`);
      },
    },
    {
      label: "Toggle Status",
      onClick: (ws) => {
        // TODO: Toggle workspace status (active <-> inactive)
        // PATCH /api/workspaces/{id}/status
        const newStatus = ws.status === "active" ? "inactive" : "active";
        if (confirm(`Change ${ws.name} status to ${newStatus}?`)) {
          alert(`Workspace status updated to: ${newStatus}`);
        }
      },
    },
    {
      label: "Delete",
      onClick: (ws) => {
        // TODO: Implement delete confirmation modal
        // DELETE /api/workspaces/{id}
        if (
          confirm(
            `Delete workspace "${ws.name}"? This action cannot be undone.`
          )
        ) {
          alert(`Deleted workspace: ${ws.name}`);
        }
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground">
            Manage office spaces and locations
          </p>
        </div>
        <Button>
          {/* TODO: Create new workspace - POST /api/workspaces */}
          Add Workspace
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Status:
          </span>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as "all" | "active" | "inactive")
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workspaces</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-muted-foreground ml-auto">
          {filteredWorkspaces.length} result
          {filteredWorkspaces.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Data Table */}
      <GenericDataTable
        data={filteredWorkspaces}
        columns={columns}
        actions={actions}
        loading={loading}
        pageSize={10}
        searchableFields={["name", "address"]}
      />
    </div>
  );
}
