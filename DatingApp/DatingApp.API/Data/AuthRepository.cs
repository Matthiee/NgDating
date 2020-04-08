using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext context;

        public AuthRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<User> Login(string username, string password)
        {
            var user = await context.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Username.Equals(username));

            if (user is null)
                return null;

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var pwBytes = Encoding.UTF8.GetBytes(password);
                var computedHash = hmac.ComputeHash(pwBytes);

                return ByteArrayCompare(passwordHash, computedHash);
            }
        }

        /// <summary>
        /// https://stackoverflow.com/a/48599119/6058174
        /// </summary>
        /// <param name="a1"></param>
        /// <param name="a2"></param>
        /// <returns></returns>
        private bool ByteArrayCompare(ReadOnlySpan<byte> a1, ReadOnlySpan<byte> a2)
            => a1.SequenceEqual(a2);

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;

            Utils.CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();

            return user;
        }

        public async Task<bool> UserExists(string username)
            => await context.Users.AnyAsync(u => u.Username.Equals(username));
    }
}
