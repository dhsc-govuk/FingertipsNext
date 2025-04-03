import { getTextColour, GovukColours } from '@/lib/styleHelpers/colours';
import { Table } from 'govuk-react';
import styled from 'styled-components';
import {
  CellType,
  heatmapDataColumnWidth,
  heatmapIndicatorTitleColumnWidth,
} from './heatmapUtil';
import { JSX } from 'react';
import { HeatmapHover, HeatmapHoverProps } from './heatmapHover';

const StyledCellText = styled(Table.Cell)({
  minHeight: '70px',
  paddingRight: 0,
});

const StyledCellNumeric = styled(Table.Cell)({
  textAlign: 'center',
  minHeight: '70px',
  width: `${heatmapDataColumnWidth}px`,
  padding: 0,
  position: 'relative',
});

const StyledCellData = styled(StyledCellNumeric)<{
  $color?: string;
  $backgroundColor?: string;
}>`
  color: ${(props) => props.$color ?? GovukColours.Black};
  background-color: ${(props) => props.$backgroundColor ?? GovukColours.White};
`;

const StyledDivDataCellContent = styled.div({
  minWidth: '60px',
  maxWidth: '80px',
  display: 'inline',
});

const StyledDivIndicatorTitleCellContent = styled.div({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  width: `${heatmapIndicatorTitleColumnWidth}px`,
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
});

const StyledDivIndicatorInformationCellContent = styled.div({
  minWidth: '40px',
  paddingRight: '20px',
});

interface HeatmapCellProps {
  cellType: CellType;
  content: string;
  backgroundColour?: string;
  hoverProps?: HeatmapHoverProps;
}

export const HeatmapCell = ({
  cellType,
  content,
  backgroundColour = GovukColours.White,
  hoverProps,
}: HeatmapCellProps): JSX.Element => {
  console.log(hoverProps);
  switch (cellType) {
    case CellType.IndicatorTitle:
      return (
        <Table.Cell data-testid="heatmap-cell-indicator-title">
          <StyledDivIndicatorTitleCellContent>
            {content}
          </StyledDivIndicatorTitleCellContent>
        </Table.Cell>
      );
    case CellType.IndicatorInformation:
      return (
        <StyledCellText data-testid="heatmap-cell-indicator-info">
          <StyledDivIndicatorInformationCellContent>
            {content}
          </StyledDivIndicatorInformationCellContent>
        </StyledCellText>
      );
    case CellType.Data: {
      if (hoverProps) {
        return (
          <StyledCellData
            $color={getTextColour(backgroundColour)}
            $backgroundColor={backgroundColour}
          >
            <StyledDivDataCellContent>
              <HeatmapHover
                areaName={hoverProps.areaName}
                period={hoverProps.period}
                indicatorName={hoverProps.indicatorName}
                value={hoverProps.value}
                unitLabel={hoverProps.unitLabel}
                benchmark={hoverProps.benchmark}
              >
                {content}
              </HeatmapHover>
            </StyledDivDataCellContent>
          </StyledCellData>
        );
      } else
        return (
          <StyledCellData
            data-testid="heatmap-cell-data"
            $color={getTextColour(backgroundColour)}
            $backgroundColor={backgroundColour}
          >
            <StyledDivDataCellContent>
              <StyledDivDataCellContent>{content}</StyledDivDataCellContent>
            </StyledDivDataCellContent>
          </StyledCellData>
        );
    }
  }
};
