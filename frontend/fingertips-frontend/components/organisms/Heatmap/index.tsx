'use client';

import { GovukColours } from '@/lib/styleHelpers/colours';
import { JSX } from 'react';
import { generateHeadersAndRows, IndicatorData } from './heatmapUtil';
import { H3, Table } from 'govuk-react';
import styled from 'styled-components';
interface HeatmapProps {
  indicatorData: IndicatorData[];
  groupAreaCode?: string;
}

const indicatorColumnWidth = '200px';
const dataColumnWidth = '60px';

// VERY WIP
const ScaledH3 = styled(H3)({
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

const RotateDiv = styled.div({
  transform: 'translate(-15px) rotate(30deg)',
  transformOrigin: 'bottom right',
});

const IndicatorsH3 = styled(H3)({
  width: indicatorColumnWidth,
});

const BenchmarkH3 = styled(ScaledH3)({
  backgroundColor: GovukColours.MidGrey,
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '4px',
  paddingRight: '4px',
});

const GroupAreaCodeH3 = styled(ScaledH3)({
  backgroundColor: GovukColours.LightGrey,
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '4px',
  paddingRight: '4px',
});

const StyledTable = styled(Table)({
  overflowY: 'scroll',
  tableLayout: 'fixed',
  width: 'min-content',
});
const StyledTitleCellHeader = styled(Table.CellHeader)({
  verticalAlign: 'bottom',
  width: indicatorColumnWidth,
});
const StyledCellHeader = styled(Table.CellHeader)({
  verticalAlign: 'bottom',
  width: dataColumnWidth,
});

const StyledIndicatorTitle = styled.div({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  width: indicatorColumnWidth,
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
});

const StyledCell = styled(Table.Cell)({
  textAlign: 'center',
  width: dataColumnWidth,
  minHeight: '70px',
  padding: 0,
});

const StyledDataCell = styled(StyledCell)<{ $backgroundColor?: string }>`
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
    pos: number,
    groupAreaCode: boolean
  ): JSX.Element => {
    switch (pos) {
      case 0:
        return <IndicatorsH3>{header}</IndicatorsH3>;
      case 1:
      case 2: {
        return <H3>{header}</H3>;
      }

      case 3: {
        return (
          <RotateDiv>
            <BenchmarkH3>Benchmark : {header}</BenchmarkH3>
          </RotateDiv>
        );
      }

      case 4: {
        if (groupAreaCode) {
          return (
            <RotateDiv>
              <GroupAreaCodeH3>{header}</GroupAreaCodeH3>
            </RotateDiv>
          );
        }
      }
    }

    return (
      <RotateDiv>
        <ScaledH3>{header}</ScaledH3>
      </RotateDiv>
    );
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
            {row.cells.map((col, colIndex) => {
              return colIndex < 2 ? (
                colIndex === 0 ? (
                  <Table.Cell key={col.key}>
                    <StyledIndicatorTitle>{col.content}</StyledIndicatorTitle>
                  </Table.Cell>
                ) : (
                  <StyledCell key={col.key}>{col.content}</StyledCell>
                )
              ) : (
                <StyledDataCell
                  key={col.key}
                  $backgroundColor={col.backgroundColour}
                >
                  {col.content}
                </StyledDataCell>
              );
            })}
          </Table.Row>
        );
      })}
    </StyledTable>
  );
}
