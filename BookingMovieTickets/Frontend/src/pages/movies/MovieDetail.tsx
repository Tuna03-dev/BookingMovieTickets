import { useMeta } from '../../hooks/useDocumentMeta';

interface MovieDetailProps {
  movie: {
    id: string;
    title: string;
    description: string;
    posterUrl: string;
  };
}

const MovieDetail = ({ movie }: MovieDetailProps) => {
  // Sử dụng useMeta hook để quản lý metadata
  useMeta({
    title: movie.title,
    description: movie.description,
    image: movie.posterUrl
  });

  return (
    <div>
      <h1>{movie.title}</h1>
      <img src={movie.posterUrl} alt={movie.title} />
      <p>{movie.description}</p>
    </div>
  );
};

export default MovieDetail; 