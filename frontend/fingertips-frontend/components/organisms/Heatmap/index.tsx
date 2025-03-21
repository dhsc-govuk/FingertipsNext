'use client';

import { HealthDataPoint } from '@/generated-sources/ft-api-client';
import { GovukColours } from '@/lib/styleHelpers/colours';
import Highcharts, { PlotHeatmapOptions } from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { JSX, useEffect, useState } from 'react';
import {
  generateAreasIndicatorsAndTableRows,
  IndicatorData,
} from './heatmapUtil';
import { H1, H3, H4, Table } from 'govuk-react';
import styled from 'styled-components';
interface HeatmapProps {
  indicatorData: IndicatorData[];
}

// VERY WIP
const RotatedH3 = styled(H3)({
  transform: 'rotate(-60deg)',
  textOverflow: 'ellipsis',
  width: '40px',
  lineHeight: '30px',
  maxHeight: '120px',
});
const BenchmarkH3 = styled(RotatedH3)({
  backgroundColor: GovukColours.MidGrey,
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingLeft: '8px',
  paddingRight: '8px',
});

const StyledTable = styled(Table)({ overflowY: 'scroll' });
const StyledCell = styled(Table.Cell)({ textAlign: 'center' });

export function Heatmap({ indicatorData }: Readonly<HeatmapProps>) {
  const { areas, indicators, tableRows } =
    // TODO - generateHeadersAndRows
    generateAreasIndicatorsAndTableRows(indicatorData);

  const generateHeaderKey = (pos: number, areaCode?: string) => {
    const prefix = 'header-';
    switch (pos) {
      case 0: {
        return prefix + 'indicator';
      }
      case 1: {
        return prefix + 'value-type';
      }
      case 2: {
        return prefix + 'period';
      }
      default: {
        return prefix + areaCode;
      }
    }
  };

  const constantHeaderTitles = ['Indicators', 'Value unit', 'Period'];
  const headers: { title: string; key: string }[] = constantHeaderTitles
    .map((title, index) => {
      return { title: title, key: generateHeaderKey(index) };
    })
    .concat(
      areas.map((area, index) => {
        return {
          title: area.name,
          key: generateHeaderKey(
            index + constantHeaderTitles.length,
            area.code
          ),
        };
      })
    );

  const generateHeader = (header: string, pos: number): JSX.Element => {
    switch (pos) {
      case 0:
      case 1:
      case 2: {
        return <H3>{header}</H3>;
      }

      case 3: {
        return <BenchmarkH3>Benchmark:{header}</BenchmarkH3>;
      }
    }

    return <RotatedH3>{header}</RotatedH3>;
  };

  return (
    <StyledTable data-testid="heatmap-component">
      <Table.Row>
        {headers.map((header, index) => {
          return (
            <Table.CellHeader key={header.key}>
              {generateHeader(header.title, index)}
            </Table.CellHeader>
          );
        })}
      </Table.Row>
      {tableRows.map((row) => {
        return (
          <Table.Row key={row.key}>
            {row.cols.map((col, colIndex) => {
              return colIndex < 2 ? (
                <Table.Cell key={col.key}>{col.content}</Table.Cell>
              ) : (
                <StyledCell key={col.key}>{col.content}</StyledCell>
              );
            })}
          </Table.Row>
        );
      })}
    </StyledTable>
  );
}
