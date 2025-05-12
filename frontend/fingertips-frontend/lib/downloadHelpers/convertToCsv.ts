const lineBreak = '\r\n';
const delimiter = ',';

export type CsvField = string | number | undefined | null;

export const convertFieldToCsv = (field: CsvField): string => {
  if (field === undefined || field === null) return '';
  const fieldStringRaw = String(field);
  const fieldString = fieldStringRaw.replace(/[\n\r]/g, '');
  const needsQuotes = /[",]/.test(fieldString);
  const escapedField = fieldString.replace(/"/g, '""');
  return needsQuotes ? `"${escapedField}"` : escapedField;
};

export const convertRowToCsv = (row: CsvField[]): string =>
  row.map(convertFieldToCsv).join(delimiter);

export const convertToCsv = (data: CsvField[][]): string =>
  data.map(convertRowToCsv).join(lineBreak);
