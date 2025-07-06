using AutoMapper;
using BookingMovieTickets.Models;
using BookingMovieTickets.DTOs;
using BookingMovieTickets.DTOs.Responses;

namespace BookingMovieTickets.Mappings
{
    public class MovieMappingProfile : Profile
    {
        public MovieMappingProfile()
        {
            CreateMap<Movie, MovieResponseDTO>()
                .ForMember(dest => dest.ShowtimeCount, opt => opt.MapFrom(src => src.Showtimes.Count))
                ;
            CreateMap<Showtime, ShowtimeResponseDTO>()
                .ForMember(dest => dest.Cinema, opt => opt.MapFrom(src => src.Room.Cinema))
                .ForMember(dest => dest.RoomNumber, opt => opt.MapFrom(src => src.Room.RoomNumber))
                .ForMember(dest => dest.TimeSlot, opt => opt.MapFrom(src => src.TimeSlot));
            CreateMap<Cinema, CinemaResponseDTO>();
            CreateMap<TimeSlot, TimeSlotDTO>();
            CreateMap<UpdateMovieDTO, Movie>()
                .ForMember(dest => dest.PosterUrl, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
            CreateMap<CreateMovieDTO, Movie>()
                .ForMember(dest => dest.MovieId, opt => opt.MapFrom(src => Guid.NewGuid()))
                .ForMember(dest => dest.PosterUrl, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
            //CreateMap<Movie, MovieDTO>()
            //    .ForMember(dest => dest.GenreName, opt => opt.MapFrom(src => src.Genre.Name))
            //    .ForMember(dest => dest.ReleaseDate, opt => opt.MapFrom(src => src.ReleaseDate.ToString("dd/MM/yyyy")));

            //CreateMap<MovieDTO, Movie>()
            //    .ForMember(dest => dest.Genre, opt => opt.Ignore())
            //    .ForMember(dest => dest.ReleaseDate, opt => opt.MapFrom(src => DateTime.Parse(src.ReleaseDate)));
        }
    }
} 