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

interface MovieDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movie?: any;
}

export function MovieDialog({ isOpen, onClose, movie }: MovieDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
    releaseDate: "",
    status: "active",
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        description: movie.description || "",
        genre: movie.genre || "",
        duration: movie.duration || "",
        releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : "",
        status: movie.status || "active",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        genre: "",
        duration: "",
        releaseDate: "",
        status: "active",
      });
    }
  }, [movie]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Movie data:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{movie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
          <DialogDescription>
            {movie ? "Update movie information" : "Add a new movie"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="releaseDate">Release Date</Label>
            <Input
              id="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
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
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{movie ? "Update Movie" : "Add Movie"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 