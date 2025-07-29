import { BasicTable } from '@/components/charts/BasicTable/BasicTable';
import { H3 } from 'govuk-react';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { useMultipleIndicatorBasicTableData } from '@/components/charts/BasicTable/hooks/useMultipleIndicatorBasicTableData';

export function MultipleIndicatorBasicTable() {
  const tableData = useMultipleIndicatorBasicTableData();

  if (!tableData || tableData.length <= 1) return null;

  return (
    <StyleChartWrapper>
      <H3>Indicator segmentations overview</H3>
      <BasicTable tableData={tableData} />
    </StyleChartWrapper>
  );
}
