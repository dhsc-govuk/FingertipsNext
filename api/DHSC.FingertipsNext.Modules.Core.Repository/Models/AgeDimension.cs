﻿using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.Core.Repository.Models
{
    [Serializable]
    public class AgeDimension
    {
        [Key]
        public required short AgeKey {  get; set; }
        [MaxLength(50)]
        public required string Name {  get; set; }
        public required short AgeID {  get; set; }
    }
}