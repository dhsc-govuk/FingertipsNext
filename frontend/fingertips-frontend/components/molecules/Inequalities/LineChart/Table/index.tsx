import { Table } from 'govuk-react';
import styled from 'styled-components';
import {
  getDisplayValue,
  StyledAlignLeftStickyTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledAlignStickyLeftHeader,
  StyledDivWithScrolling,
  StyledTableCellHeader,
} from '@/lib/tableHelpers';
import {
  getYearsWithInequalityData,
  InequalitiesChartData,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { ReactNode } from 'react';
import { convertInequalitiesTrendTableToCsvData } from './convertInequalitiesTrendTableToCsvData';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';

export enum InequalitiesTableHeadingsEnum {
  PERIOD = 'Period',
}

interface InequalitiesLineChartTableProps {
  inequalityTypeSelected: string;
  indicatorMetadata?: IndicatorDocument;
  tableData: InequalitiesChartData;
  dynamicKeys: string[];
  title?: string;
}

const StyledTable = styled(Table)({
  borderCollapse: 'separate',
  marginBottom: '1rem',
});

const StyledAlignCenterHeader = styled(StyledTableCellHeader)({
  textAlign: 'center',
});

const StyledAlignRightHeaderWithPadding = styled(StyledAlignRightHeader)({
  paddingLeft: '10px',
});

const getCellHeader = (heading: string, index: number): ReactNode => {
  if (heading === InequalitiesTableHeadingsEnum.PERIOD) {
    return (
      <StyledAlignStickyLeftHeader
        data-testid={`header-${heading}-${index}`}
        key={heading + index}
        style={{ paddingLeft: '10px' }}
      >
        {heading}
      </StyledAlignStickyLeftHeader>
    );
  }

  if (heading === 'Persons') {
    return (
      <StyledAlignRightHeader
        data-testid={`header-${heading}-${index}`}
        key={heading + index}
        style={{ paddingRight: '10px' }}
      >
        {heading}
      </StyledAlignRightHeader>
    );
  }

  return (
    <StyledAlignRightHeaderWithPadding
      data-testid={`header-${heading}-${index}`}
      key={heading + index}
    >
      {heading}
    </StyledAlignRightHeaderWithPadding>
  );
};

export function InequalitiesLineChartTable({
  inequalityTypeSelected,
  indicatorMetadata,
  tableData,
  dynamicKeys,
  title,
}: Readonly<InequalitiesLineChartTableProps>) {
  const tableHeaders = [
    ...Object.values(InequalitiesTableHeadingsEnum),
    ...dynamicKeys,
  ];

  const yearsWithInequalityData = getYearsWithInequalityData(tableData.rowData);
  if (!yearsWithInequalityData.length) {
    return null;
  }
  const firstYear = Math.min(...yearsWithInequalityData);
  const lastYear = Math.max(...yearsWithInequalityData);
  const filteredRowData = tableData.rowData.filter(
    (data) => data.period >= firstYear && data.period <= lastYear
  );

  const csvData = convertInequalitiesTrendTableToCsvData(
    tableData.areaCode,
    tableData.areaName,
    inequalityTypeSelected,
    filteredRowData,
    indicatorMetadata
  );

  return (
    <>
      <StyledDivWithScrolling data-testid="inequalitiesLineChartTable-component">
        <div id="inequalitiesTrendTable">
          <ChartTitle>{title}</ChartTitle>
          <StyledTable
            head={
              <>
                <Table.Row>
                  <StyledAlignCenterHeader colSpan={tableHeaders.length}>
                    {tableData.areaName}
                    {indicatorMetadata?.unitLabel ? (
                      <span
                        style={{ display: 'block', marginTop: '10px' }}
                        data-testid="inequalitiesLineChartTable-measurementUnit"
                      >
                        Value: {indicatorMetadata.unitLabel}
                      </span>
                    ) : null}
                  </StyledAlignCenterHeader>
                </Table.Row>
                <Table.Row>
                  {tableHeaders.map((heading, index) =>
                    getCellHeader(heading, index)
                  )}
                </Table.Row>
              </>
            }
          >
            {filteredRowData.map((data, index) => (
              <Table.Row key={String(data.period) + index}>
                <StyledAlignLeftStickyTableCell>
                  {String(data.period)}
                </StyledAlignLeftStickyTableCell>
                {dynamicKeys.map((key, index) => (
                  <StyledAlignRightTableCell
                    key={key + index}
                    style={{ paddingRight: '10px' }}
                  >
                    {getDisplayValue(data.inequalities[key]?.value)}
                  </StyledAlignRightTableCell>
                ))}
              </Table.Row>
            ))}
          </StyledTable>
          <ExportOnlyWrapper>
            <ExportCopyright />
          </ExportOnlyWrapper>
        </div>
      </StyledDivWithScrolling>
      <ExportOptionsButton
        targetId={'inequalitiesTrendTable'}
        csvData={csvData}
      />
    </>
  );
}
