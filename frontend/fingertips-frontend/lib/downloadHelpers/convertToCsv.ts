const lineBreak = '\r\n';
const delimiter = ',';

export type CsvField = string | number | undefined | null;
export type CsvRow = CsvField[];
export type CsvData = CsvRow[];

export const convertFieldToCsv = (field: CsvField): string => {
  if (field === undefined || field === null) return '';
  const fieldStringRaw = String(field);
  const fieldString = fieldStringRaw.replace(/[\n\r]/g, '');
  const needsQuotes = /[",]/.test(fieldString);
  const escapedField = fieldString.replace(/"/g, '""');
  return needsQuotes ? `"${escapedField}"` : escapedField;
};

export const convertRowToCsv = (row: CsvRow): string =>
  row.map(convertFieldToCsv).join(delimiter);

export const convertToCsv = (data: CsvData): string =>
  data.map(convertRowToCsv).join(lineBreak).trim();
