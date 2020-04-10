using AutoMapper;
using DatingApp.API.Dto;
using DatingApp.API.Models;
using DatingApp.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Helper
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(d => d.PhotoUrl, opt => opt.MapFrom(
                    src => src.Photos.FirstOrDefault(
                        photo => photo.IsMain).Url))
                .ForMember(d => d.Age, opt => opt.MapFrom(
                    src => src.DateOfBirth.GetAge()));

            CreateMap<User, UserForDetailDto>()
                .ForMember(d => d.PhotoUrl, opt => opt.MapFrom(
                    src => src.Photos.FirstOrDefault(
                        photo => photo.IsMain).Url))
                .ForMember(d => d.Age, opt => opt.MapFrom(
                    src => src.DateOfBirth.GetAge()));

            CreateMap<UserForRegisterDto, User>();

            CreateMap<Photo, PhotoForDetailedDto>();

            CreateMap<UserForUpdateDto, User>();

            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>();
        }
    }
}
