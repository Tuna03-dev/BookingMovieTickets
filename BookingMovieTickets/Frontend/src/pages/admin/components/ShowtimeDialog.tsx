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

interface ShowtimeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  showtime?: any;
}

export function ShowtimeDialog({ isOpen, onClose, showtime }: ShowtimeDialogProps) {
  const [formData, setFormData] = useState({
    movieId: "",
    roomId: "",
    startTime: "",
    endTime: "",
    status: "scheduled",
  });

  useEffect(() => {
    if (showtime) {
      setFormData({
        movieId: showtime.movieId || "",
        roomId: showtime.roomId || "",
        startTime: showtime.startTime ? showtime.startTime.slice(0, 16) : "",
        endTime: showtime.endTime ? showtime.endTime.slice(0, 16) : "",
        status: showtime.status || "scheduled",
      });
    } else {
      setFormData({
        movieId: "",
        roomId: "",
        startTime: "",
        endTime: "",
        status: "scheduled",
      });
    }
  }, [showtime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Showtime data:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{showtime ? "Edit Showtime" : "Add New Showtime"}</DialogTitle>
          <DialogDescription>
            {showtime ? "Update showtime information" : "Add a new showtime"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="movieId">Movie ID</Label>
            <Input
              id="movieId"
              value={formData.movieId}
              onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomId">Room ID</Label>
            <Input
              id="roomId"
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
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
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{showtime ? "Update Showtime" : "Add Showtime"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 