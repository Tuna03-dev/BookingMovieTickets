import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  movieApis,
  type MovieCreateDTO,
  type MovieUpdateDTO,
} from "@/services/movieApis";
import type { Movie } from "../Movie";

interface MovieDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movie?: Movie;
}

export function MovieDialog({ isOpen, onClose, movie }: MovieDialogProps) {
  const MovieSchema = z.object({
    title: z.string().min(1, "Vui lòng nhập tên phim"),
    description: z.string().min(1, "Vui lòng nhập mô tả"),
    genre: z.string().min(1, "Vui lòng nhập thể loại"),
    duration: z.coerce.number().min(1, "Thời lượng phải lớn hơn 0"),
    releaseDate: z.string().min(1, "Vui lòng chọn ngày phát hành"),
    status: z.enum(["Đang chiếu", "Sắp chiếu", "Ngừng chiếu"]),
    actors: z.string().min(1, "Vui lòng nhập diễn viên"),
    director: z.string().min(1, "Vui lòng nhập đạo diễn"),
    posterFile: z.any().refine(
      (file) => {
        // Nếu là update và đã có posterUrl thì không bắt buộc
        if (currentPosterUrl) return true;
        // Nếu thêm mới hoặc chưa có posterUrl thì phải có file
        return file instanceof File;
      },
      { message: "Vui lòng chọn ảnh poster" }
    ),
  });

  type MovieFormType = z.infer<typeof MovieSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<MovieFormType>({
    resolver: zodResolver(MovieSchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      duration: 0,
      releaseDate: "",
      status: "Đang chiếu",
      actors: "",
      director: "",
      posterFile: undefined as any,
    },
  });

  // For preview
  const posterFile = watch("posterFile");
  // Lưu posterUrl hiện tại nếu là update
  const currentPosterUrl = movie?.posterUrl;

  useEffect(() => {
    if (movie) {
      reset({
        title: movie.title || "",
        description: movie.description || "",
        genre: movie.genre || "",
        duration: movie.duration || 0,
        releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : "",
        status:
          (movie.status as "Đang chiếu" | "Sắp chiếu" | "Ngừng chiếu") ||
          "Đang chiếu",
        actors: movie.actors || "",
        director: movie.director || "",
        posterFile: undefined,
      });
    } else {
      reset();
    }
  }, [movie, reset]);

  const handlePosterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue("posterFile", e.target.files[0], { shouldValidate: true });
    }
  };

  const onSubmit = async (values: MovieFormType) => {
    const data = new FormData();
    data.append("Title", values.title);
    data.append("Description", values.description);
    data.append("Genre", values.genre);
    data.append("Duration", values.duration.toString());
    data.append("ReleaseDate", values.releaseDate);
    data.append("Status", values.status);
    data.append("Actors", values.actors);
    data.append("Director", values.director);
    if (values.posterFile) {
      data.append("Poster", values.posterFile);
    }
    try {
      if (movie && movie.movieId) {
        await movieApis.updateMovie(String(movie.movieId), data);
        toast.success("Cập nhật phim thành công!");
      } else {
        await movieApis.createMovie(data);
        toast.success("Thêm phim thành công!");
      }
      onClose();
    } catch (err) {
      toast.error("Có lỗi xảy ra khi lưu phim!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{movie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
          <DialogDescription>
            {movie ? "Update movie information" : "Add a new movie"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} required />
              {errors.title && (
                <div className="text-xs text-red-500">
                  {errors.title.message}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" {...register("genre")} required />
              {errors.genre && (
                <div className="text-xs text-red-500">
                  {errors.genre.message}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                {...register("duration", { valueAsNumber: true })}
                required
              />
              {errors.duration && (
                <div className="text-xs text-red-500">
                  {errors.duration.message}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input
                id="releaseDate"
                type="date"
                {...register("releaseDate")}
                required
              />
              {errors.releaseDate && (
                <div className="text-xs text-red-500">
                  {errors.releaseDate.message}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue("status", value as any, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đang chiếu">Đang chiếu</SelectItem>
                  <SelectItem value="Sắp chiếu">Sắp chiếu</SelectItem>
                  <SelectItem value="Ngừng chiếu">Ngừng chiếu</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <div className="text-xs text-red-500">
                  {errors.status.message}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="actors">Diễn viên</Label>
              <Input id="actors" {...register("actors")} required />
              {errors.actors && (
                <div className="text-xs text-red-500">
                  {errors.actors.message}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="director">Đạo diễn</Label>
              <Input id="director" {...register("director")} required />
              {errors.director && (
                <div className="text-xs text-red-500">
                  {errors.director.message}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} required />
            {errors.description && (
              <div className="text-xs text-red-500">
                {errors.description.message}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="posterFile">Poster (ảnh)</Label>
            <Input
              id="posterFile"
              type="file"
              accept="image/*"
              onChange={handlePosterFileChange}
              required={!currentPosterUrl}
            />
            {errors.posterFile && typeof errors.posterFile.message === "string" && (
              <div className="text-xs text-red-500">
                {errors.posterFile.message}
              </div>
            )}
            {/* Hiển thị poster hiện tại nếu là update và chưa chọn file mới */}
            {!posterFile && currentPosterUrl && (
              <div className="mt-2">
                <span className="text-xs">Poster hiện tại:</span>
                <img
                  src={currentPosterUrl}
                  alt="Poster preview"
                  className="mt-2 max-h-20 rounded"
                  style={{ maxWidth: 80, maxHeight: 80 }}
                />
              </div>
            )}
            {posterFile && (
              <div className="mt-2">
                <span className="text-xs">Đã chọn: {posterFile.name}</span>
                <img
                  src={URL.createObjectURL(posterFile)}
                  alt="Poster preview"
                  className="mt-2 max-h-20 rounded"
                  style={{ maxWidth: 80, maxHeight: 80 }}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {movie ? "Update Movie" : "Add Movie"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
