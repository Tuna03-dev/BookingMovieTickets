using BookingMovieTickets.Models;
using BookingMovieTickets.Repositories;
using BookingMovieTickets.Services;
using BookingMovieTickets.DTOs;
using AutoMapper;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace BookingMovieTickets.Services.Implements
{
    public class RoomService : IRoomService
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IMapper _mapper;

        public RoomService(IRoomRepository roomRepository, IMapper mapper)
        {
            _roomRepository = roomRepository;
            _mapper = mapper;
        }

        public IQueryable<Room> GetRooms() => _roomRepository.GetRooms();
        
        public async Task<RoomResponseDTO?> GetRoomByIdAsync(Guid id)
        {
            var room = await _roomRepository.GetByIdAsync(id);
            return room == null ? null : _mapper.Map<RoomResponseDTO>(room);
        }
        
        public async Task<RoomResponseDTO> AddRoomAsync(Room room)
        {
            var addedRoom = await _roomRepository.AddAsync(room);
            return _mapper.Map<RoomResponseDTO>(addedRoom);
        }
        
        public async Task<RoomResponseDTO?> UpdateRoomAsync(Room room)
        {
            var updatedRoom = await _roomRepository.UpdateAsync(room.RoomId, room);
            return updatedRoom == null ? null : _mapper.Map<RoomResponseDTO>(updatedRoom);
        }
        
        public Task<bool> DeleteRoomAsync(Guid id) => _roomRepository.DeleteAsync(id);

        public async Task<List<RoomResponseDTO>> GetRoomsByCinemaAsync(Guid cinemaId)
        {
            var rooms = _roomRepository.GetRooms().Where(r => r.CinemaId == cinemaId).ToList();
            return _mapper.Map<List<RoomResponseDTO>>(rooms);
        }
    }
} 