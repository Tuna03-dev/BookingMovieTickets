import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { AdminLayout } from "../../layouts/AdminLayout";
import { DataTableServerSide } from "../../components/admin/data-table-server-side";
import { ColumnHeader } from "../../components/admin/columns";

type TimeSlot = {
  timeSlotId: string;
  startTime: string;
  endTime: string;
};

export default function TimeSlotPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );

  const columns: ColumnDef<TimeSlot>[] = [
    {
      accessorKey: "timeSlotId",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Time Slot ID" />
      ),
    },
    {
      accessorKey: "startTime",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Start Time" />
      ),
    },
    {
      accessorKey: "endTime",
      header: ({ column }) => <ColumnHeader column={column} title="End Time" />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTimeSlot(row.original);
              setIsDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Time Slots</h1>
            <p className="text-muted-foreground">
              Manage time slots for showtimes
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedTimeSlot(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Time Slot
          </Button>
        </div>
        <DataTableServerSide
          columns={columns}
          onPaginationChange={async () => ({ value: [], totalCount: 0 })}
        />
        {/* TODO: TimeSlotDialog */}
      </div>
    </>
  );
}
