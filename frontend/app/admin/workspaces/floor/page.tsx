"use client";

import { useState } from "react";
import {
  GenericDataTable,
  Column,
  Action,
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
 * Floor Management page for workspaces
 * TODO: Replace mock data with API calls:
 * - GET /api/workspaces/{workspaceId}/floors
 * - POST /api/floors (create new floor)
 * - PATCH /api/floors/{id} (edit floor)
 * - DELETE /api/floors/{id} (delete floor)
 */

type Floor = {
  id: string;
  name: string;
  workspaceName: string;
  status: "active" | "inactive" | "maintenance";
  spaceCount: number;
  createdAt: Date;
};

const mockFloors: Floor[] = [
  // CoLab Downtown (3 floors, 37 spaces total)
  {
    id: "floor-1",
    name: "Floor 1",
    workspaceName: "CoLab Downtown",
    status: "active",
    spaceCount: 12,
    createdAt: new Date("2025-11-20T08:00:00Z"),
  },
  {
    id: "floor-2",
    name: "Floor 2",
    workspaceName: "CoLab Downtown",
    status: "active",
    spaceCount: 15,
    createdAt: new Date("2025-11-20T09:00:00Z"),
  },
  {
    id: "floor-3",
    name: "Floor 3",
    workspaceName: "CoLab Downtown",
    status: "active",
    spaceCount: 10,
    createdAt: new Date("2025-11-20T10:00:00Z"),
  },
  // CoLab Tech Hub (2 floors, 32 spaces total)
  {
    id: "floor-4",
    name: "Floor 1",
    workspaceName: "CoLab Tech Hub",
    status: "active",
    spaceCount: 18,
    createdAt: new Date("2025-10-25T10:00:00Z"),
  },
  {
    id: "floor-5",
    name: "Floor 2",
    workspaceName: "CoLab Tech Hub",
    status: "active",
    spaceCount: 14,
    createdAt: new Date("2025-10-25T11:00:00Z"),
  },
  // CoLab Binh Thanh (2 floors, 14 spaces total)
  {
    id: "floor-6",
    name: "Floor 1",
    workspaceName: "CoLab Binh Thanh",
    status: "active",
    spaceCount: 8,
    createdAt: new Date("2025-09-15T11:00:00Z"),
  },
  {
    id: "floor-7",
    name: "Floor 2",
    workspaceName: "CoLab Binh Thanh",
    status: "active",
    spaceCount: 6,
    createdAt: new Date("2025-09-15T12:00:00Z"),
  },
];

export default function FloorsPage() {
  const [floors, setFloors] = useState<Floor[]>(mockFloors);
  const [loading, setLoading] = useState(false);
  const [workspaceFilter, setWorkspaceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "maintenance"
  >("all");

  // Get unique workspace names for filter
  const workspaceNames = Array.from(
    new Set(floors.map((f) => f.workspaceName))
  );

  // Filter floors based on workspace and status
  const filteredFloors = floors.filter((floor) => {
    const workspaceMatch =
      workspaceFilter === "all" || floor.workspaceName === workspaceFilter;
    const statusMatch = statusFilter === "all" || floor.status === statusFilter;
    return workspaceMatch && statusMatch;
  });

  const columns: Column<Floor>[] = [
    {
      key: "name",
      label: "Floor Name",
      sortable: true,
      width: "w-32",
    },
    {
      key: "workspaceName",
      label: "Workspace",
      sortable: true,
      width: "w-40",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (floor) => (
        <Badge
          variant={
            floor.status === "active"
              ? "default"
              : floor.status === "maintenance"
              ? "secondary"
              : "destructive"
          }
        >
          {floor.status}
        </Badge>
      ),
    },
    {
      key: "spaceCount",
      label: "Spaces",
      sortable: true,
      render: (floor) => (
        <span className="font-medium">{floor.spaceCount}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (floor) => floor.createdAt.toLocaleDateString("vi-VN"),
    },
  ];

  const actions: Action<Floor>[] = [
    {
      label: "View Details",
      onClick: (floor) => {
        // TODO: Show floor details modal
        // GET /api/floors/{id}
        const details = `Floor: ${floor.name}\nWorkspace: ${
          floor.workspaceName
        }\nStatus: ${floor.status}\nSpaces: ${
          floor.spaceCount
        }\nCreated: ${floor.createdAt.toLocaleDateString("vi-VN")}`;
        alert(details);
      },
    },
    {
      label: "Edit",
      onClick: (floor) => {
        // TODO: Open edit modal with form
        // PATCH /api/floors/{id}
        alert(`Edit floor: ${floor.name}`);
      },
    },
    {
      label: "Manage Spaces",
      onClick: (floor) => {
        // TODO: Navigate to space management page
        // GET /api/floors/{id}/spaces
        alert(`Manage spaces in: ${floor.name}`);
      },
    },
    {
      label: "Toggle Status",
      onClick: (floor) => {
        // TODO: Toggle floor status
        // PATCH /api/floors/{id}/status
        const statuses = ["active", "maintenance", "inactive"];
        const currentIndex = statuses.indexOf(floor.status);
        const newStatus = statuses[(currentIndex + 1) % statuses.length];
        if (confirm(`Change status to ${newStatus}?`)) {
          alert(`Floor status updated to: ${newStatus}`);
        }
      },
    },
    {
      label: "Delete",
      onClick: (floor) => {
        // TODO: Show delete confirmation with warning about spaces
        // DELETE /api/floors/{id}
        if (
          confirm(
            `Delete floor "${floor.name}" with ${floor.spaceCount} spaces? This action cannot be undone.`
          )
        ) {
          alert(`Deleted floor: ${floor.name}`);
          setFloors((prev) => prev.filter((f) => f.id !== floor.id));
        }
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Floors</h1>
          <p className="text-muted-foreground">
            Manage building floors and their spaces
          </p>
        </div>
        <Button>
          {/* TODO: Create new floor - POST /api/floors */}
          Add Floor
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Workspace:
          </span>
          <Select value={workspaceFilter} onValueChange={setWorkspaceFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workspaces</SelectItem>
              {workspaceNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Status:
          </span>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(
                value as "all" | "active" | "inactive" | "maintenance"
              )
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="text-sm text-muted-foreground ml-auto">
          {filteredFloors.length} result{filteredFloors.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Data Table */}
      <GenericDataTable
        data={filteredFloors}
        columns={columns}
        actions={actions}
        loading={loading}
        pageSize={10}
        searchableFields={["name", "workspaceName"]}
      />
    </div>
  );
}
