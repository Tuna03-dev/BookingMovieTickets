import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  room?: any;
}

export function RoomDialog({ isOpen, onClose, room }: RoomDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    status: "active",
  });

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || "",
        type: room.type || "",
        capacity: room.capacity || "",
        status: room.status || "active",
      });
    } else {
      setFormData({
        name: "",
        type: "",
        capacity: "",
        status: "active",
      });
    }
  }, [room]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Room data:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{room ? "Edit Room" : "Add New Room"}</DialogTitle>
          <DialogDescription>
            {room ? "Update room information" : "Add a new room"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{room ? "Update Room" : "Add Room"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 