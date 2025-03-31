const numberFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

export function formatNumber(value?: number): string {
  return value !== undefined ? numberFormat.format(value) : 'X';
}

/*
  heatmaps - no special number formatting, 'X' used for undefined
  maps tooltips - no special formatting. examples had values such as '14.2 units'
  SpineChartTableRow - no special number formatting, 'X' used for undefined
  LineChartTable - no special number formatting
  lineChartsHelper - custom formatter for tooltip
  BarChartEmbeddedTable - no special number formatting


  needs looking at
  ~~~~~~~~~~~~~~~~
  search for 'tooltip: {' and check for formatter methods
  lineChartHelpers.ts - lineChartDefaultOptions.tooltip.format
  generateInequalitiesLineChartTooltipStringList
  tooltips in general
 */
