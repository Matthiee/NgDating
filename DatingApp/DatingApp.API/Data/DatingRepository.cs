using DatingApp.API.Helper;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext context;

        public DatingRepository(DataContext context)
        {
            this.context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            context.Remove(entity);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
            => await context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);

        public async Task<Photo> GetPhoto(int id)
            => await context.Photos.FirstOrDefaultAsync(p => p.Id == id);

        public async Task<User> GetUser(int id)
            => await context.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == id);

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

            var userQuery = context.Users
                .OrderByDescending(u => u.LastActive)
                .Where(u => u.Id != userParams.UserId)
                .Where(u => u.Gender == userParams.Gender)
                .Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob)
                .Include(u => u.Photos).AsQueryable();

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        userQuery = userQuery.OrderByDescending(u => u.Created);
                        break;
                }
            }

            return await userQuery.AsPagedAsync(userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll()
            => await context.SaveChangesAsync() > 0;
    }
}
