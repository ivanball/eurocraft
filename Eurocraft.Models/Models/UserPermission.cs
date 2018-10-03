using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("UserPermission")]
    public partial class UserPermission
    {
        [Column("UserPermissionID")]
        public int UserPermissionId { get; set; }
        [Column("EntityDomainID")]
        public int? EntityDomainId { get; set; }
        [Column("UserProfileID")]
        public int? UserProfileId { get; set; }
        [StringLength(100)]
        public string UserPermissionValue { get; set; }
    }
}
