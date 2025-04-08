import styled from 'styled-components';
import { SpineChartLegendItem } from '@/components/organisms/SpineChart/SpineChartLegend/SpineChartLegendItem';
import { SpineChartLegendTypes } from '@/components/organisms/SpineChart/SpineChartLegend/SpineChartLegend.types';
import { FC } from 'react';
import { BenchmarkLegends } from '@/components/organisms/BenchmarkLegend';
import { BenchmarkLegendsToShow } from '@/components/organisms/BenchmarkLegend/benchmarkLegend.types';

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
}

export const SpineChartLegend: FC<SpineChartLegendProps> = ({
  legendsToShow,
}) => {
  return (
    <DivContainer>
      <FlexDiv>
        <SpineChartLegendItem itemType={SpineChartLegendTypes.Benchmark}>
          Benchmark: England
        </SpineChartLegendItem>
        <SpineChartLegendItem itemType={SpineChartLegendTypes.Group}>
          Group:Name
        </SpineChartLegendItem>
        <SpineChartLegendItem itemType={SpineChartLegendTypes.Area}>
          Area
        </SpineChartLegendItem>
      </FlexDiv>

      <BenchmarkLegends legendsToShow={legendsToShow} />
    </DivContainer>
  );
};
