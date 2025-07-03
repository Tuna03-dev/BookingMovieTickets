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

interface TimeSlotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  timeSlot?: any;
}

export function TimeSlotDialog({ isOpen, onClose, timeSlot }: TimeSlotDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    status: "active",
  });

  useEffect(() => {
    if (timeSlot) {
      setFormData({
        name: timeSlot.name || "",
        startTime: timeSlot.startTime ? timeSlot.startTime.slice(0, 5) : "",
        endTime: timeSlot.endTime ? timeSlot.endTime.slice(0, 5) : "",
        status: timeSlot.status || "active",
      });
    } else {
      setFormData({
        name: "",
        startTime: "",
        endTime: "",
        status: "active",
      });
    }
  }, [timeSlot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("TimeSlot data:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{timeSlot ? "Edit Time Slot" : "Add New Time Slot"}</DialogTitle>
          <DialogDescription>
            {timeSlot ? "Update time slot information" : "Add a new time slot"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
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
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{timeSlot ? "Update Time Slot" : "Add Time Slot"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 