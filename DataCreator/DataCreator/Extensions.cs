using System.Text.RegularExpressions;

namespace DataCreator
{
    public static class String
    {
        public static string StripHTML(this string input) => input == null ? null : Regex.Replace(input, "<.*?>", string.Empty);

        public static string CleanAreaCode(this string input) => string.IsNullOrEmpty(input) ? input : input.StartsWith("nE") ? input.TrimStart('n') : input;
    }
}
