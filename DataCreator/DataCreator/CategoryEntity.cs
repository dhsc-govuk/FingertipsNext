namespace DataCreator
{
    public record CategoryEntity
    {
        public string CategoryName { get; set; }
        
        public string CategoryTypeName { get; set; }
        public int Sequence { get; set; }
    }
}
