import styled from 'styled-components';
import { SpineChartLegendItem } from '@/components/organisms/SpineChartLegend/SpineChartLegendItem';
import { SpineChartLegendTypes } from '@/components/organisms/SpineChartLegend/SpineChartLegend.types';
import React, { FC } from 'react';
import { BenchmarkLegends } from '@/components/organisms/BenchmarkLegend';
import { BenchmarkLegendsToShow } from '@/components/organisms/BenchmarkLegend/benchmarkLegend.types';
import { englandAreaString } from '@/lib/chartHelpers/constants';
import { SpineChartQuartilesInfoContainer } from '@/components/organisms/SpineChart/SpineChartQuartilesInfo';

const DivContainer = styled.div({
  fontFamily: 'nta, Arial, sans-serif',
  marginBottom: '0.5rem',
});

const FlexDiv = styled.div({
  display: 'flex',
  gap: '1rem',
});

interface SpineChartLegendProps {
  legendsToShow: BenchmarkLegendsToShow;
  benchmarkName?: string;
  groupName?: string;
  areaNames?: string[];
}

export const SpineChartLegend: FC<SpineChartLegendProps> = ({
  legendsToShow,
  benchmarkName = 'England',
  groupName = '',
  areaNames = ['Area'],
}) => {
  return (
    <DivContainer>
      <FlexDiv>
        <SpineChartLegendItem itemType={SpineChartLegendTypes.Benchmark}>
          Benchmark: {benchmarkName}
        </SpineChartLegendItem>
        {groupName !== englandAreaString ? (
          <SpineChartLegendItem itemType={SpineChartLegendTypes.Group}>
            Group: {groupName}
          </SpineChartLegendItem>
        ) : null}
        {areaNames.map((name, index) => (
          <SpineChartLegendItem
            key={`SpineChartLegendItem-${name}`}
            itemType={
              index === 0
                ? SpineChartLegendTypes.Area
                : SpineChartLegendTypes.AreaTwo
            }
          >
            {name}
          </SpineChartLegendItem>
        ))}
      </FlexDiv>

      <BenchmarkLegends legendsToShow={legendsToShow} bottomMargin={false} />
      <SpineChartQuartilesInfoContainer />
    </DivContainer>
  );
};
