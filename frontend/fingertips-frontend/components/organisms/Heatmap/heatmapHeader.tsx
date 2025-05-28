import { GovukColours } from '@/lib/styleHelpers/colours';
import { H4, Table } from 'govuk-react';
import { FC } from 'react';
import styled from 'styled-components';
import {
  HeaderType,
  heatmapDataColumnWidth,
  heatmapIndicatorTitleColumnWidth,
} from './heatmapUtil';

const StyledDivRotate = styled.div({
  position: 'relative',
  height: '50px',
});

const StyledH4Header = styled(H4)({
  height: '50px',
  margin: 0,
});

const StyledH4IndicatorHeader = styled(StyledH4Header)({
  width: `${heatmapIndicatorTitleColumnWidth}px`,
});

const StyledH4AreaScaled = styled(H4)({
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflowX: 'hidden',
  display: 'block',
  margin: '0px',
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '4px 8px',
  transformOrigin: 'top left',
  transform: 'translate(0, 15px) rotate(-60deg)',
});

const StyledH4BenchmarkHeader = styled(StyledH4AreaScaled)({
  backgroundColor: GovukColours.MidGrey,
});

const StyledH4GroupAreaCodeHeader = styled(StyledH4AreaScaled)({
  backgroundColor: GovukColours.LightGrey,
});

const stickyLeft = {
  background: 'white',
  position: 'sticky',
  left: 0,
  zIndex: 1,
  paddingRight: '10px',
};

interface HeatmapHeaderProps {
  headerType: HeaderType;
  content: string;
}

const StyledCellHeaderIndicatorTitle = styled(Table.CellHeader)({
  ...(stickyLeft as unknown as TemplateStringsArray),
  verticalAlign: 'bottom',
  width: `${heatmapIndicatorTitleColumnWidth}px`,
  paddingLeft: '10px',
});

const StyledCellHeaderArea = styled(Table.CellHeader)({
  verticalAlign: 'bottom',
  width: `${heatmapDataColumnWidth}px`,
  paddingRight: '0px',
  paddingLeft: '10px',
  height: '300px',
});

const StyledCellHeaderIndicatorInformationValueUnit = styled(Table.CellHeader)({
  verticalAlign: 'bottom',
  paddingRight: '10px',
  paddingLeft: '10px',
  textAlign: 'left',
});

const StyledCellHeaderIndicatorInformationPeriod = styled(Table.CellHeader)({
  verticalAlign: 'bottom',
  paddingRight: '10px',
  paddingLeft: '10px',
  textAlign: 'right',
});

export const HeatmapHeader: FC<HeatmapHeaderProps> = ({
  headerType,
  content,
}) => {
  switch (headerType) {
    case HeaderType.IndicatorTitle:
      return (
        <StyledCellHeaderIndicatorTitle>
          <StyledH4IndicatorHeader>{content}</StyledH4IndicatorHeader>
        </StyledCellHeaderIndicatorTitle>
      );

    case HeaderType.IndicatorInformationPeriod:
      return (
        <StyledCellHeaderIndicatorInformationPeriod>
          <StyledH4Header>{content}</StyledH4Header>
        </StyledCellHeaderIndicatorInformationPeriod>
      );

    case HeaderType.IndicatorInformationValueUnit:
      return (
        <StyledCellHeaderIndicatorInformationValueUnit>
          <StyledH4Header>{content}</StyledH4Header>
        </StyledCellHeaderIndicatorInformationValueUnit>
      );

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
            <StyledH4GroupAreaCodeHeader>
              Group: {content}
            </StyledH4GroupAreaCodeHeader>
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
