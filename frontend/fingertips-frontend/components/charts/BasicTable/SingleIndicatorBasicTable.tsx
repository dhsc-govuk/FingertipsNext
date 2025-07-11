import { BasicTable } from '@/components/charts/BasicTable/BasicTable';
import { H3 } from 'govuk-react';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { useSingleIndicatorBasicTableData } from '@/components/charts/BasicTable/hooks/useSingleIndicatorBasicTableData';

export function SingleIndicatorBasicTable() {
  const tableData = useSingleIndicatorBasicTableData();

  if (!tableData || tableData.length <= 1) return null;

  return (
    <StyleChartWrapper>
      <H3>Indicator segmentations overview</H3>
      <BasicTable
        tableData={tableData}
        id={'singleIndicatorBasicTable'}
        title={'Segmentation overview of selected indicator'}
      />
    </StyleChartWrapper>
  );
}
