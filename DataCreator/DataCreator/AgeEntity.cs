namespace DataCreator
{
    public record AgeEntity
    {
        public int AgeID { get; set; }
        public string Age { get; set; }
        public int MinYears { get; set; }
        public int MaxYears { get; set; }
    }
}
