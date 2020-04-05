using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API
{
    public static class Extensions
    {
        public static int GetAge(this DateTime input)
        {
            var age = DateTime.Today.Year - input.Year;

            if (input.AddYears(age) > DateTime.Today)
                age--;

            return age;
        }
    }
}
