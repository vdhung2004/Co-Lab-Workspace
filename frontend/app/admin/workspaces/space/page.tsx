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
 * Space Management page for floors
 * TODO: Replace mock data with API calls:
 * - GET /api/floors/{floorId}/spaces
 * - POST /api/spaces (create space)
 * - PATCH /api/spaces/{id} (edit space)
 * - DELETE /api/spaces/{id} (delete space)
 * - GET /api/spaces/{id}/amenities (space amenities)
 * - POST /api/spaces/{id}/amenities (add amenities)
 */

type Space = {
  id: string;
  name: string;
  floorName: string;
  workspaceName: string;
  type: "desk" | "meeting_room";
  capacity: number;
  priceHourly: number;
  status: "available" | "maintenance";
  description?: string;
  createdAt: Date;
};

const mockSpaces: Space[] = [
  // ===== CoLab Downtown - Floor 1 (9 spaces: 7 desks + 2 meeting rooms) =====
  {
    id: "space-1",
    name: "Desk D1-1",
    floorName: "Floor 1",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-22T09:00:00Z"),
  },
  {
    id: "space-2",
    name: "Desk D1-2",
    floorName: "Floor 1",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-22T09:15:00Z"),
  },
  {
    id: "space-3",
    name: "Desk D1-3",
    floorName: "Floor 1",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-22T09:30:00Z"),
  },
  {
    id: "space-4",
    name: "Desk D1-4",
    floorName: "Floor 1",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-22T09:45:00Z"),
  },
  {
    id: "space-5",
    name: "Desk D1-5",
    floorName: "Floor 1",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-22T10:00:00Z"),
  },
  {
    id: "space-6",
    name: "Desk D1-6",
    floorName: "Floor 1",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-22T10:15:00Z"),
  },
  {
    id: "space-7",
    name: "Desk D1-7",
    floorName: "Floor 1",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-22T10:30:00Z"),
  },
  {
    id: "space-8",
    name: "Meeting Room A",
    floorName: "Floor 1",
    workspaceName: "CoLab Downtown",
    type: "meeting_room",
    capacity: 6,
    priceHourly: 200000,
    status: "available",
    description: "Small meeting room with whiteboard",
    createdAt: new Date("2025-11-22T11:00:00Z"),
  },
  {
    id: "space-9",
    name: "Conference Room A",
    floorName: "Floor 1",
    workspaceName: "CoLab Downtown",
    type: "meeting_room",
    capacity: 8,
    priceHourly: 250000,
    status: "available",
    description: "Conference room with projector",
    createdAt: new Date("2025-11-22T11:30:00Z"),
  },
  // ===== CoLab Downtown - Floor 2 (8 spaces: 5 desks + 2 meeting rooms) =====
  {
    id: "space-10",
    name: "Desk D2-1",
    floorName: "Floor 2",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-21T09:00:00Z"),
  },
  {
    id: "space-11",
    name: "Desk D2-2",
    floorName: "Floor 2",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-21T09:15:00Z"),
  },
  {
    id: "space-12",
    name: "Desk D2-3",
    floorName: "Floor 2",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-21T09:30:00Z"),
  },
  {
    id: "space-13",
    name: "Desk D2-4",
    floorName: "Floor 2",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-21T09:45:00Z"),
  },
  {
    id: "space-14",
    name: "Desk D2-5",
    floorName: "Floor 2",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "maintenance",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-21T10:00:00Z"),
  },
  {
    id: "space-15",
    name: "Meeting Room B",
    floorName: "Floor 2",
    workspaceName: "CoLab Downtown",
    type: "meeting_room",
    capacity: 8,
    priceHourly: 250000,
    status: "available",
    description: "Large meeting room with projector",
    createdAt: new Date("2025-11-21T11:00:00Z"),
  },
  {
    id: "space-16",
    name: "Conference Room B",
    floorName: "Floor 2",
    workspaceName: "CoLab Downtown",
    type: "meeting_room",
    capacity: 10,
    priceHourly: 300000,
    status: "available",
    description: "Large conference room",
    createdAt: new Date("2025-11-21T11:30:00Z"),
  },
  // ===== CoLab Downtown - Floor 3 (7 spaces: 4 desks + 2 meeting rooms) =====
  {
    id: "space-17",
    name: "Desk D3-1",
    floorName: "Floor 3",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-20T09:00:00Z"),
  },
  {
    id: "space-18",
    name: "Desk D3-2",
    floorName: "Floor 3",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-20T09:15:00Z"),
  },
  {
    id: "space-19",
    name: "Desk D3-3",
    floorName: "Floor 3",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-20T09:30:00Z"),
  },
  {
    id: "space-20",
    name: "Desk D3-4",
    floorName: "Floor 3",
    workspaceName: "CoLab Downtown",
    type: "desk",
    capacity: 1,
    priceHourly: 50000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-11-20T09:45:00Z"),
  },
  {
    id: "space-21",
    name: "Meeting Room C",
    floorName: "Floor 3",
    workspaceName: "CoLab Downtown",
    type: "meeting_room",
    capacity: 6,
    priceHourly: 200000,
    status: "available",
    description: "Small meeting room",
    createdAt: new Date("2025-11-20T10:00:00Z"),
  },
  // ===== CoLab Tech Hub - Floor 1 (9 spaces: 6 desks + 2 meeting rooms) =====
  {
    id: "space-22",
    name: "Desk T1-1",
    floorName: "Floor 1",
    workspaceName: "CoLab Tech Hub",
    type: "desk",
    capacity: 1,
    priceHourly: 55000,
    status: "available",
    description: "High-tech workspace desk",
    createdAt: new Date("2025-10-25T10:00:00Z"),
  },
  {
    id: "space-23",
    name: "Desk T1-2",
    floorName: "Floor 1",
    workspaceName: "CoLab Tech Hub",
    type: "desk",
    capacity: 1,
    priceHourly: 55000,
    status: "available",
    description: "High-tech workspace desk",
    createdAt: new Date("2025-10-25T10:15:00Z"),
  },
  {
    id: "space-24",
    name: "Desk T1-3",
    floorName: "Floor 1",
    workspaceName: "CoLab Tech Hub",
    type: "desk",
    capacity: 1,
    priceHourly: 55000,
    status: "available",
    description: "High-tech workspace desk",
    createdAt: new Date("2025-10-25T10:30:00Z"),
  },
  {
    id: "space-25",
    name: "Desk T1-4",
    floorName: "Floor 1",
    workspaceName: "CoLab Tech Hub",
    type: "desk",
    capacity: 1,
    priceHourly: 55000,
    status: "available",
    description: "High-tech workspace desk",
    createdAt: new Date("2025-10-25T10:45:00Z"),
  },
  {
    id: "space-26",
    name: "Desk T1-5",
    floorName: "Floor 1",
    workspaceName: "CoLab Tech Hub",
    type: "desk",
    capacity: 1,
    priceHourly: 55000,
    status: "available",
    description: "High-tech workspace desk",
    createdAt: new Date("2025-10-25T11:00:00Z"),
  },
  {
    id: "space-27",
    name: "Meeting Room D",
    floorName: "Floor 1",
    workspaceName: "CoLab Tech Hub",
    type: "meeting_room",
    capacity: 8,
    priceHourly: 280000,
    status: "available",
    description: "Tech-equipped meeting room",
    createdAt: new Date("2025-10-25T11:30:00Z"),
  },
  {
    id: "space-28",
    name: "Conference Room C",
    floorName: "Floor 1",
    workspaceName: "CoLab Tech Hub",
    type: "meeting_room",
    capacity: 12,
    priceHourly: 350000,
    status: "available",
    description: "Executive conference room",
    createdAt: new Date("2025-10-25T12:00:00Z"),
  },
  // ===== CoLab Tech Hub - Floor 2 (7 spaces: 5 desks + 1 meeting room) =====
  {
    id: "space-29",
    name: "Desk T2-1",
    floorName: "Floor 2",
    workspaceName: "CoLab Tech Hub",
    type: "desk",
    capacity: 1,
    priceHourly: 55000,
    status: "available",
    description: "High-tech workspace desk",
    createdAt: new Date("2025-10-24T09:00:00Z"),
  },
  {
    id: "space-30",
    name: "Desk T2-2",
    floorName: "Floor 2",
    workspaceName: "CoLab Tech Hub",
    type: "desk",
    capacity: 1,
    priceHourly: 55000,
    status: "available",
    description: "High-tech workspace desk",
    createdAt: new Date("2025-10-24T09:15:00Z"),
  },
  {
    id: "space-31",
    name: "Desk T2-3",
    floorName: "Floor 2",
    workspaceName: "CoLab Tech Hub",
    type: "desk",
    capacity: 1,
    priceHourly: 55000,
    status: "maintenance",
    description: "High-tech workspace desk",
    createdAt: new Date("2025-10-24T09:30:00Z"),
  },
  {
    id: "space-32",
    name: "Desk T2-4",
    floorName: "Floor 2",
    workspaceName: "CoLab Tech Hub",
    type: "desk",
    capacity: 1,
    priceHourly: 55000,
    status: "available",
    description: "High-tech workspace desk",
    createdAt: new Date("2025-10-24T09:45:00Z"),
  },
  {
    id: "space-33",
    name: "Desk T2-5",
    floorName: "Floor 2",
    workspaceName: "CoLab Tech Hub",
    type: "desk",
    capacity: 1,
    priceHourly: 55000,
    status: "available",
    description: "High-tech workspace desk",
    createdAt: new Date("2025-10-24T10:00:00Z"),
  },
  {
    id: "space-34",
    name: "Meeting Room E",
    floorName: "Floor 2",
    workspaceName: "CoLab Tech Hub",
    type: "meeting_room",
    capacity: 10,
    priceHourly: 300000,
    status: "available",
    description: "Large meeting room",
    createdAt: new Date("2025-10-24T11:00:00Z"),
  },
  // ===== CoLab Binh Thanh - Floor 1 (4 spaces: 3 desks + 1 meeting room) =====
  {
    id: "space-35",
    name: "Desk B1-1",
    floorName: "Floor 1",
    workspaceName: "CoLab Binh Thanh",
    type: "desk",
    capacity: 1,
    priceHourly: 45000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-09-15T11:00:00Z"),
  },
  {
    id: "space-36",
    name: "Desk B1-2",
    floorName: "Floor 1",
    workspaceName: "CoLab Binh Thanh",
    type: "desk",
    capacity: 1,
    priceHourly: 45000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-09-15T11:15:00Z"),
  },
  {
    id: "space-37",
    name: "Desk B1-3",
    floorName: "Floor 1",
    workspaceName: "CoLab Binh Thanh",
    type: "desk",
    capacity: 1,
    priceHourly: 45000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-09-15T11:30:00Z"),
  },
  {
    id: "space-38",
    name: "Meeting Room F",
    floorName: "Floor 1",
    workspaceName: "CoLab Binh Thanh",
    type: "meeting_room",
    capacity: 6,
    priceHourly: 180000,
    status: "available",
    description: "Small meeting room",
    createdAt: new Date("2025-09-15T12:00:00Z"),
  },
  // ===== CoLab Binh Thanh - Floor 2 (3 spaces: 2 desks + 1 meeting room) =====
  {
    id: "space-39",
    name: "Desk B2-1",
    floorName: "Floor 2",
    workspaceName: "CoLab Binh Thanh",
    type: "desk",
    capacity: 1,
    priceHourly: 45000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-09-14T09:00:00Z"),
  },
  {
    id: "space-40",
    name: "Desk B2-2",
    floorName: "Floor 2",
    workspaceName: "CoLab Binh Thanh",
    type: "desk",
    capacity: 1,
    priceHourly: 45000,
    status: "available",
    description: "Single desk in co-working area",
    createdAt: new Date("2025-09-14T09:15:00Z"),
  },
  {
    id: "space-41",
    name: "Meeting Room G",
    floorName: "Floor 2",
    workspaceName: "CoLab Binh Thanh",
    type: "meeting_room",
    capacity: 8,
    priceHourly: 220000,
    status: "available",
    description: "Medium meeting room",
    createdAt: new Date("2025-09-14T10:00:00Z"),
  },
];

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>(mockSpaces);
  const [loading, setLoading] = useState(false);
  const [workspaceFilter, setWorkspaceFilter] = useState<string>("all");
  const [floorFilter, setFloorFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "desk" | "meeting_room">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "maintenance"
  >("all");

  // Get unique workspace names
  const workspaceNames = Array.from(
    new Set(spaces.map((s) => s.workspaceName))
  );

  // Get unique floor names for currently selected workspace
  const floorNames = Array.from(
    new Set(
      spaces
        .filter(
          (s) =>
            workspaceFilter === "all" || s.workspaceName === workspaceFilter
        )
        .map((s) => s.floorName)
    )
  );

  // Filter spaces: workspace first, then floor, type, and status
  const filteredSpaces = spaces.filter((space) => {
    const workspaceMatch =
      workspaceFilter === "all" || space.workspaceName === workspaceFilter;
    const floorMatch = floorFilter === "all" || space.floorName === floorFilter;
    const typeMatch = typeFilter === "all" || space.type === typeFilter;
    const statusMatch = statusFilter === "all" || space.status === statusFilter;
    return workspaceMatch && floorMatch && typeMatch && statusMatch;
  });

  const columns: Column<Space>[] = [
    {
      key: "name",
      label: "Space Name",
      sortable: true,
      width: "w-32",
    },
    {
      key: "floorName",
      label: "Floor",
      sortable: true,
      width: "w-28",
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (space) => (
        <Badge variant="secondary">
          {space.type === "desk" ? "Desk" : "Meeting Room"}
        </Badge>
      ),
    },
    {
      key: "capacity",
      label: "Capacity",
      sortable: true,
      render: (space) => <span className="font-medium">{space.capacity}</span>,
    },
    {
      key: "priceHourly",
      label: "Price/Hour",
      sortable: true,
      render: (space) => (
        <span className="font-medium">
          {space.priceHourly.toLocaleString("vi-VN")} đ
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (space) => (
        <Badge variant={space.status === "available" ? "default" : "secondary"}>
          {space.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (space) => space.createdAt.toLocaleDateString("vi-VN"),
    },
  ];

  const actions: Action<Space>[] = [
    {
      label: "View Details",
      onClick: (space) => {
        // TODO: Show space details modal
        // GET /api/spaces/{id}
        const details = `Space: ${space.name}\nFloor: ${
          space.floorName
        }\nWorkspace: ${space.workspaceName}\nType: ${
          space.type === "desk" ? "Desk" : "Meeting Room"
        }\nCapacity: ${
          space.capacity
        }\nPrice: ${space.priceHourly.toLocaleString(
          "vi-VN"
        )} đ/hour\nStatus: ${space.status}\nDescription: ${
          space.description || "N/A"
        }`;
        alert(details);
      },
    },
    {
      label: "Edit",
      onClick: (space) => {
        // TODO: Open edit modal with form
        // PATCH /api/spaces/{id}
        alert(`Edit space: ${space.name}`);
      },
    },
    {
      label: "Manage Amenities",
      onClick: (space) => {
        // TODO: Open amenities dialog
        // GET /api/spaces/{id}/amenities
        // POST /api/spaces/{id}/amenities (add/remove)
        alert(`Manage amenities for: ${space.name}`);
      },
    },
    {
      label: "View Bookings",
      onClick: (space) => {
        // TODO: Show bookings for this space
        // GET /api/spaces/{id}/bookings
        alert(`View bookings for: ${space.name}`);
      },
    },
    {
      label: "Toggle Status",
      onClick: (space) => {
        // TODO: Toggle space status
        // PATCH /api/spaces/{id}/status
        const newStatus =
          space.status === "available" ? "maintenance" : "available";
        if (confirm(`Change status to ${newStatus}?`)) {
          alert(`Space status updated to: ${newStatus}`);
        }
      },
    },
    {
      label: "Delete",
      onClick: (space) => {
        // TODO: Show delete confirmation
        // DELETE /api/spaces/{id}
        if (
          confirm(`Delete space "${space.name}"? This action cannot be undone.`)
        ) {
          alert(`Deleted space: ${space.name}`);
          setSpaces((prev) => prev.filter((s) => s.id !== space.id));
        }
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spaces</h1>
          <p className="text-muted-foreground">
            Manage desks, meeting rooms and other spaces
          </p>
        </div>
        <Button>
          {/* TODO: Create new space - POST /api/spaces */}
          Add Space
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Workspace:
          </span>
          <Select
            value={workspaceFilter}
            onValueChange={(value) => {
              setWorkspaceFilter(value);
              setFloorFilter("all");
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workspaces</SelectItem>
              {workspaceNames.map((workspace) => (
                <SelectItem key={workspace} value={workspace}>
                  {workspace}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Floor:
          </span>
          <Select value={floorFilter} onValueChange={setFloorFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              {floorNames.map((floor) => (
                <SelectItem key={floor} value={floor}>
                  {floor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Type:
          </span>
          <Select
            value={typeFilter}
            onValueChange={(value) =>
              setTypeFilter(value as "all" | "desk" | "meeting_room")
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="desk">Desk</SelectItem>
              <SelectItem value="meeting_room">Meeting Room</SelectItem>
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
              setStatusFilter(value as "all" | "available" | "maintenance")
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="text-sm text-muted-foreground ml-auto">
          {filteredSpaces.length} result{filteredSpaces.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Data Table */}
      <GenericDataTable
        data={filteredSpaces}
        columns={columns}
        actions={actions}
        loading={loading}
        pageSize={10}
        searchableFields={["name", "floorName"]}
      />
    </div>
  );
}
