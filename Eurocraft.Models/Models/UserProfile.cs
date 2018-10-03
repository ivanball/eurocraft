using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("UserProfile")]
    public partial class UserProfile
    {
        [Column("UserProfileID")]
        public int UserProfileId { get; set; }
        [Required]
        [Column("UserID")]
        [StringLength(450)]
        public string UserId { get; set; }
        [StringLength(500)]
        public string Email { get; set; }
        [StringLength(100)]
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool HasLoggedIn { get; set; }
    }
}
