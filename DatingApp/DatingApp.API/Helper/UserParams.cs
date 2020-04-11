using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Helper
{
    public class UserParams
    {
		public const int DefaultMinAge = 18;
		public const int DefaultMaxAge = 99;
		private const int MaxPageSize = 50;

        public int PageNumber { get; set; } = 1;
		private int pageSize;

		public int PageSize
		{
			get { return pageSize; }
			set { pageSize =  value > MaxPageSize ? MaxPageSize : value; }
		}

		public int UserId { get; set; }
		public string Gender { get; set; }
		public int MaxAge { get; set; } = DefaultMaxAge;
		public int MinAge { get; set; } = DefaultMinAge;

		public string OrderBy { get; set; }

		public bool Likees { get; set; } = false;
		public bool Likers { get; set; } = false;

	}
}
