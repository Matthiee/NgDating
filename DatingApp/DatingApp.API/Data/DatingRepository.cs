﻿using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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

        public async Task<Photo> GetPhoto(int id)
            => await context.Photos.FirstOrDefaultAsync(p => p.Id == id);

        public async Task<User> GetUser(int id)
            => await context.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == id);

        public async Task<IEnumerable<User>> GetUsers() 
            => await context.Users.Include(u => u.Photos).ToListAsync();

        public async Task<bool> SaveAll()
            => await context.SaveChangesAsync() > 0;
    }
}
