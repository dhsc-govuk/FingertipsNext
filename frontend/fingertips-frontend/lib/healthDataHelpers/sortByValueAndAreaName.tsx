import { BarChartEmbeddedTableRow } from '@/components/charts/CompareAreasTable/BarChartEmbeddedTable/BarChartEmbeddedTable.types';

export function sortByValueAndAreaName(
  a: BarChartEmbeddedTableRow,
  b: BarChartEmbeddedTableRow
): number {
  if (!a.value && !b.value) return 0;

  if (!a.value) return 1;

  if (!b.value) return -1;

  const valueResult = b.value - a.value;

  if (valueResult != 0) return valueResult;

  return a.area.localeCompare(b.area, undefined, { sensitivity: 'base' });
}
