"use client";

import { useState } from "react";
import {
  Column,
  Action,
  GenericDataTable,
} from "@/components/admin/GenericDataTable";
import { Button } from "@/components/ui/button";

/**
 * Mock Amenity data matching Prisma Amenity schema
 * TODO: Replace with API call to GET /api/amenities
 * Example: const response = await fetch('/api/amenities?limit=100')
 */
type Amenity = {
  id: string;
  name: string;
  icon: string;
  createdAt: Date;
};

const mockAmenities: Amenity[] = [
  {
    id: "amenity-1",
    name: "Projector",
    icon: "📽️",
    createdAt: new Date("2025-12-01T10:00:00Z"),
  },
  {
    id: "amenity-2",
    name: "Whiteboard",
    icon: "📝",
    createdAt: new Date("2025-12-02T11:00:00Z"),
  },
  {
    id: "amenity-3",
    name: "Coffee Machine",
    icon: "☕",
    createdAt: new Date("2025-12-03T12:00:00Z"),
  },
  {
    id: "amenity-4",
    name: "WiFi Router",
    icon: "📡",
    createdAt: new Date("2025-12-04T09:00:00Z"),
  },
  {
    id: "amenity-5",
    name: "Air Conditioner",
    icon: "❄️",
    createdAt: new Date("2025-12-05T14:30:00Z"),
  },
];

export default function AmenitiesPage() {
  // State management for future API integration
  const [amenities, setAmenities] = useState<Amenity[]>(mockAmenities);
  const [loading, setLoading] = useState(false);

  // Column configuration
  const columns: Column<Amenity>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      width: "w-32",
    },
    {
      key: "icon",
      label: "Icon",
      width: "w-16",
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (amenity) => amenity.createdAt.toLocaleDateString("vi-VN"),
    },
  ];

  // Row actions
  const actions: Action<Amenity>[] = [
    {
      label: "View",
      onClick: (amenity) => {
        // TODO: Show amenity details and usage statistics
        // GET /api/amenities/{id}
        const details = `Amenity: ${amenity.name}\nIcon: ${
          amenity.icon
        }\nCreated: ${amenity.createdAt.toLocaleDateString("vi-VN")}`;
        alert(details);
      },
    },
    {
      label: "Edit",
      onClick: (amenity) => {
        // TODO: Implement edit modal
        // PATCH /api/amenities/{id}
        alert(`Edit amenity: ${amenity.name}`);
      },
    },
    {
      label: "Delete",
      onClick: (amenity) => {
        // TODO: Implement delete confirmation modal with warning
        // DELETE /api/amenities/{id}
        if (
          confirm(
            `Delete amenity "${amenity.name}"? Spaces using this amenity will be unaffected.`
          )
        ) {
          alert(`Deleted amenity: ${amenity.name}`);
          setAmenities((prev) => prev.filter((a) => a.id !== amenity.id));
        }
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Amenities</h1>
          <p className="text-muted-foreground">
            Manage available amenities and facilities
          </p>
        </div>
        <Button>
          {/* TODO: Add new amenity modal - POST /api/amenities */}
          Add Amenity
        </Button>
      </div>

      {/* Data Table */}
      <GenericDataTable
        data={amenities}
        columns={columns}
        actions={actions}
        loading={loading}
        pageSize={10}
        searchableFields={["name"]}
      />
    </div>
  );
}
