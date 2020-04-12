using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Data
{
    public static class Seed
    {
        public static async Task SeedUsers(UserManager<User> userManager)
        {
            if (userManager.Users.Any()) return;

            // https://www.json-generator.com/
            var userData = File.ReadAllText("Data/UserSeedData.json");
            var users = JsonConvert.DeserializeObject<List<User>>(userData);

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "password");
            }
        }
    }
}
