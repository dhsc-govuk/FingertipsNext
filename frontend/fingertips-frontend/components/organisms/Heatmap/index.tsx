'use client';

import { GovukColours } from '@/lib/styleHelpers/colours';
import { JSX } from 'react';
import { generateHeadersAndRows, IndicatorData } from './heatmapUtil';
import { H3, H4, Table } from 'govuk-react';
import styled from 'styled-components';
interface HeatmapProps {
  indicatorData: IndicatorData[];
  groupAreaCode?: string;
}

const StyledTable = styled(Table)({
  overflowY: 'scroll',
  tableLayout: 'fixed',
  width: 'min-content',
});

const indicatorTitleColumnWidth = '240px';
const titleColumnWidth = '60px';
const dataColumnWidth = '60px';

// Area Headers
const StyledDivRotate = styled.div({
  transform: 'translate(-15px) rotate(30deg)',
  transformOrigin: 'bottom right',
});

const StyledH4AreaScaled = styled(H4)({
  transform: 'scale(-1)',
  transformOrigin: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  maxWidth: '40px',
  writingMode: 'vertical-lr',
  maxHeight: '300px',
  display: 'block',
});

const StyledH4BenchmarkHeader = styled(StyledH4AreaScaled)({
  backgroundColor: GovukColours.MidGrey,
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '4px',
  paddingRight: '4px',
});

const StyledH4GroupAreaCodeHeader = styled(StyledH4AreaScaled)({
  backgroundColor: GovukColours.LightGrey,
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '4px',
  paddingRight: '4px',
});

// Indicator Headers
const StyledH4IndicatorHeader = styled(H4)({
  width: indicatorTitleColumnWidth,
});

const StyledTitleCellHeader = styled(Table.CellHeader)({
  verticalAlign: 'bottom',
  width: indicatorTitleColumnWidth,
});
const StyledCellHeader = styled(Table.CellHeader)({
  verticalAlign: 'bottom',
  width: dataColumnWidth,
  paddingRight: '0px',
});

const StyledIndicatorCellContent = styled.div({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  width: indicatorTitleColumnWidth,
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
});

// Cells
const StyledCellValueUnit = styled(Table.Cell)({
  width: titleColumnWidth,
  minHeight: '70px',
  padding: 0,
});

const StyledCellPeriod = styled(Table.Cell)({
  textAlign: 'center',
  width: dataColumnWidth,
  minHeight: '70px',
  padding: 0,
});

const StyledCellData = styled(Table.Cell)({
  textAlign: 'center',
  width: dataColumnWidth,
  minHeight: '70px',
  padding: 0,
});

const StyledCellDataWithBackground = styled(StyledCellData)<{
  $backgroundColor?: string;
}>`
  background-color: ${(props) =>
    props.$backgroundColor ? props.$backgroundColor : GovukColours.White};
`;

export function Heatmap({
  indicatorData,
  groupAreaCode,
}: Readonly<HeatmapProps>) {
  const { headers, rows } = generateHeadersAndRows(
    indicatorData,
    groupAreaCode
  );

  const generateHeader = (
    header: string,
    position: number,
    groupAreaCode: boolean
  ): JSX.Element => {
    switch (position) {
      case 0:
        return <StyledH4IndicatorHeader>{header}</StyledH4IndicatorHeader>;
      case 1:
      case 2: {
        return <H4>{header}</H4>;
      }

      case 3: {
        return (
          <StyledDivRotate>
            <StyledH4BenchmarkHeader>
              Benchmark : {header}
            </StyledH4BenchmarkHeader>
          </StyledDivRotate>
        );
      }

      case 4: {
        if (groupAreaCode) {
          return (
            <StyledDivRotate>
              <StyledH4GroupAreaCodeHeader>
                {header}
              </StyledH4GroupAreaCodeHeader>
            </StyledDivRotate>
          );
        }
      }
    }

    return (
      <StyledDivRotate>
        <StyledH4AreaScaled>{header}</StyledH4AreaScaled>
      </StyledDivRotate>
    );
  };

  const generateCell = (
    cell: { key: string; content: string; backgroundColour?: string },
    position: number
  ): JSX.Element => {
    switch (position) {
      case 0:
        return (
          <Table.Cell key={cell.key}>
            <StyledIndicatorCellContent>
              {cell.content}
            </StyledIndicatorCellContent>
          </Table.Cell>
        );
      case 1:
        return (
          <StyledCellValueUnit key={cell.key}>
            {cell.content}
          </StyledCellValueUnit>
        );
      case 2:
        <StyledCellPeriod key={cell.key}>{cell.content}</StyledCellPeriod>;
      default:
        return (
          <StyledCellDataWithBackground
            key={cell.key}
            $backgroundColor={cell.backgroundColour}
          >
            {cell.content}
          </StyledCellDataWithBackground>
        );
    }
  };

  return (
    <StyledTable data-testid="heatmap-component">
      <Table.Row>
        {headers.map((header, index) => {
          return index < 1 ? (
            <StyledTitleCellHeader key={header.key}>
              {generateHeader(header.content, index, false)}
            </StyledTitleCellHeader>
          ) : (
            <StyledCellHeader key={header.key}>
              {generateHeader(
                header.content,
                index,
                groupAreaCode !== undefined
              )}
            </StyledCellHeader>
          );
        })}
      </Table.Row>
      {rows.map((row) => {
        return (
          <Table.Row key={row.key}>
            {row.cells.map((cell, cellIndex) => {
              return generateCell(cell, cellIndex);
            })}
          </Table.Row>
        );
      })}
    </StyledTable>
  );
}
