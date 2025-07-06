using AutoMapper;
using BookingMovieTickets.DTOs;
using BookingMovieTickets.Models;

namespace BookingMovieTickets.Mappings
{
    public class RoomMappingProfile : Profile
    {
        public RoomMappingProfile()
        {
            CreateMap<Room, RoomResponseDTO>();
            CreateMap<Room, RoomWithCinemaDTO>();
            CreateMap<Cinema, CinemaBasicDTO>();
        }
    }
} 