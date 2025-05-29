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
  margin: '0px',
});

const StyledH4PrimaryBenchmarkHeader = styled(StyledH4AreaScaled)({
  backgroundColor: GovukColours.MidGrey,
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '4px',
  paddingRight: '4px',
});

const StyledH4SecondaryBenchmarkHeader = styled(StyledH4AreaScaled)({
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

const stickyLeft = {
  background: 'white',
  position: 'sticky',
  left: 0,
  zIndex: 1,
  paddingRight: '0.5em',
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
  paddingLeft: '1em',
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

    case HeaderType.PrimaryBenchmarkArea: {
      return (
        <StyledCellHeaderArea>
          <StyledDivRotate>
            <StyledH4PrimaryBenchmarkHeader>
              {content}
            </StyledH4PrimaryBenchmarkHeader>
          </StyledDivRotate>
        </StyledCellHeaderArea>
      );
    }

    case HeaderType.SecondaryBenchmarkArea: {
      return (
        <StyledCellHeaderArea>
          <StyledDivRotate>
            <StyledH4SecondaryBenchmarkHeader>
              {content}
            </StyledH4SecondaryBenchmarkHeader>
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
