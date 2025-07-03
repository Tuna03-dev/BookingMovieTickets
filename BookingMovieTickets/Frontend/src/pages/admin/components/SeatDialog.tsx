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

interface SeatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  seat?: any;
}

export function SeatDialog({ isOpen, onClose, seat }: SeatDialogProps) {
  const [formData, setFormData] = useState({
    seatNumber: "",
    row: "",
    type: "",
    status: "available",
  });

  useEffect(() => {
    if (seat) {
      setFormData({
        seatNumber: seat.seatNumber || "",
        row: seat.row || "",
        type: seat.type || "",
        status: seat.status || "available",
      });
    } else {
      setFormData({
        seatNumber: "",
        row: "",
        type: "",
        status: "available",
      });
    }
  }, [seat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Seat data:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{seat ? "Edit Seat" : "Add New Seat"}</DialogTitle>
          <DialogDescription>
            {seat ? "Update seat information" : "Add a new seat"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seatNumber">Seat Number</Label>
            <Input
              id="seatNumber"
              value={formData.seatNumber}
              onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="row">Row</Label>
            <Input
              id="row"
              value={formData.row}
              onChange={(e) => setFormData({ ...formData, row: e.target.value })}
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
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="broken">Broken</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{seat ? "Update Seat" : "Add Seat"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 