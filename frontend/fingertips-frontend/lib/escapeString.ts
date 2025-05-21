/*
   escape characters in string before use with AI search 
   please see this documentation for more details
   reference: https://learn.microsoft.com/en-us/azure/search/query-lucene-syntax#escaping-special-characters
*/
export const escapeString = (text: string): string => {
  return text.replace(/[+\-&|!(){}[\]^"~*?:\\/]/g, '\\$&');
};
