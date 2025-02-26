namespace DataCreator
{
    public record CategoryEntity
    {
        public int CategoryID { get; set; }
        public string CategoryName { get; set; }
        public int Sequence { get; set; }
        public int CategoryTypeID { get; set; }
        public string CategoryTypeName { get; set; }
    }
}
