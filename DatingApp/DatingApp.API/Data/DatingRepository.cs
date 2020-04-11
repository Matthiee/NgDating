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

        public async Task<Like> GetLike(int userId, int recipientId)
            => await context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);


        public async Task<Photo> GetMainPhotoForUser(int userId)
            => await context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);

        public async Task<Photo> GetPhoto(int id)
            => await context.Photos.FirstOrDefaultAsync(p => p.Id == id);

        public async Task<User> GetUser(int id)
            => await context.Users.FirstOrDefaultAsync(u => u.Id == id);

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

            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);

                userQuery = userQuery.Where(u => userLikers.Contains(u.Id));
            }

            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);

                userQuery = userQuery.Where(u => userLikees.Contains(u.Id));
            }

            return await userQuery.AsPagedAsync(userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (likers)
            {
                return user.Liker.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }
            else
            {
                return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
            => await context.SaveChangesAsync() > 0;

        public async Task<Message> GetMessage(int id)
            => await context.Messages.FirstOrDefaultAsync(m => m.Id == id);

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = context.Messages.AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId && !u.RecipientDeleted);
                    break;

                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId && !u.SenderDeleted);
                    break;
                default:
                    messages = messages.Where(u => !u.IsRead && u.RecipientId == messageParams.UserId && !u.RecipientDeleted);
                    break;
            }

            messages = messages.OrderByDescending(m => m.MessageSent);
            return await messages.AsPagedAsync(messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await context.Messages
                .Where(m => m.RecipientId == userId && !m.RecipientDeleted && m.SenderId == recipientId
                    || m.RecipientId == recipientId && !m.SenderDeleted  && m.SenderId == userId)
                .OrderByDescending(m => m.MessageSent)
                .ToListAsync();

            return messages;
        }
    }
}
