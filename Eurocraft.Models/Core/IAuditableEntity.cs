using System;

namespace Eurocraft.Models
{
    public interface IAuditableEntity
    {
        string AdmIsActive { get; set; }
        DateTime AdmCreated { get; set; }
        int AdmCreatedBy { get; set; }
        DateTime? AdmModified { get; set; }
        int? AdmModifiedBy { get; set; }
    }


}
