using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace DataCreator.IO
{

    internal interface IFileReader<TData>
    {
        TData Read();
    }
    internal class CSVReader: IFileReader<DataTable>
    {
        private string filename;
        public CSVReader(string filename){
            if (!Path.Exists(filename))
            {
                throw new FileNotFoundException(filename);
            }
            this.filename = filename;
        }
        public DataTable Read() {
            var name = Path.GetFileNameWithoutExtension(this.filename);
            DataTable table = new DataTable(name);
            using (var reader = new StreamReader(this.filename))
            {
                bool isFirstLine = true;
                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    if (line == null) continue;
                    var values = Regex.Split(line, "[,]{1}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
                    
                    if (isFirstLine)
                    {
                        foreach (var header in values)
                        {
                            table.Columns.Add(header.Trim());
                        }
                        isFirstLine = false;
                    }
                    else
                    {
                        table.Rows.Add(values);
                    }
                }
            }
            return table;
        }
    }
}
