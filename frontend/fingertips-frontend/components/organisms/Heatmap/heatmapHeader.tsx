import { GovukColours } from '@/lib/styleHelpers/colours';
import { H4, Table } from 'govuk-react';
import { JSX } from 'react';
import styled from 'styled-components';
import {
  HeaderType,
  heatmapDataColumnWidth,
  heatmapIndicatorTitleColumnWidth,
} from './heatmapUtil';

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

const StyledH4Header = styled(H4)({
  height: '30px',
});

const StyledH4IndicatorHeader = styled(StyledH4Header)({
  width: `${heatmapIndicatorTitleColumnWidth}px`,
});

interface HeatmapHeaderProps {
  headerType: HeaderType;
  content: string;
}

const StyledCellHeaderIndicatorTitle = styled(Table.CellHeader)({
  verticalAlign: 'bottom',
  width: `${heatmapIndicatorTitleColumnWidth}px`,
});

const StyledCellHeaderIndicatorInformation = styled(Table.CellHeader)({
  verticalAlign: 'bottom',
  paddingRight: '0px',
});

const StyledCellHeaderArea = styled(Table.CellHeader)({
  verticalAlign: 'bottom',
  width: `${heatmapDataColumnWidth}px`,
  paddingRight: '0px',
});

export const HeatmapHeader = ({
  headerType,
  content,
}: HeatmapHeaderProps): JSX.Element => {
  switch (headerType) {
    case HeaderType.IndicatorTitle:
      return (
        <StyledCellHeaderIndicatorTitle>
          <StyledH4IndicatorHeader>{content}</StyledH4IndicatorHeader>
        </StyledCellHeaderIndicatorTitle>
      );

    case HeaderType.IndicatorInformation: {
      return (
        <StyledCellHeaderIndicatorInformation>
          <StyledH4Header>{content}</StyledH4Header>
        </StyledCellHeaderIndicatorInformation>
      );
    }

    case HeaderType.BenchmarkArea: {
      return (
        <StyledCellHeaderArea>
          <StyledDivRotate>
            <StyledH4BenchmarkHeader>
              Benchmark: {content}
            </StyledH4BenchmarkHeader>
          </StyledDivRotate>
        </StyledCellHeaderArea>
      );
    }

    case HeaderType.GroupArea: {
      return (
        <StyledCellHeaderArea>
          <StyledDivRotate>
            <StyledH4GroupAreaCodeHeader>{content}</StyledH4GroupAreaCodeHeader>
          </StyledDivRotate>
        </StyledCellHeaderArea>
      );
    }

    case HeaderType.Area:
      return (
        <StyledCellHeaderArea>
          <StyledDivRotate>
            <StyledH4AreaScaled>{content}</StyledH4AreaScaled>
          </StyledDivRotate>
        </StyledCellHeaderArea>
      );
  }
};
