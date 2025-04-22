import { getTextColour, GovukColours } from '@/lib/styleHelpers/colours';
import { Table } from 'govuk-react';
import styled from 'styled-components';
import { CellType, heatmapIndicatorTitleColumnWidth } from './heatmapUtil';
import { FC, MouseEventHandler } from 'react';

const stickyLeft = {
  background: 'white',
  position: 'sticky',
  left: 0,
  zIndex: 1,
  paddingRight: '0.5em',
};

const StyledIndicatorCell = styled(Table.Cell)({
  ...(stickyLeft as unknown as TemplateStringsArray),
  borderRight: 'solid #bfc1c3 1px',
});

const StyledCellText = styled(Table.Cell)({
  minHeight: '70px',
  paddingRight: 0,
});

const StyledCellNumeric = styled(Table.Cell)({
  textAlign: 'center',
  padding: 0,
  position: 'relative',
  borderLeft: `1px solid #bfc1c3`,
  verticalAlign: 'middle',
});

const StyledCellData = styled(StyledCellNumeric)<{
  $color?: string;
  $backgroundColor?: string;
}>`
  color: ${(props) => props.$color ?? GovukColours.Black};
  background-color: ${(props) => props.$backgroundColor ?? GovukColours.White};
`;

const StyledDivDataCellContent = styled.div({
  margin: '2px',
  padding: '10px',
  minWidth: '40px',
  maxWidth: '120px',
  minHeight: '2em',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
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
  paddingLeft: '20px',
});

interface HeatmapCellProps {
  cellType: CellType;
  content: string;
  backgroundColour?: string;
  mouseEnterHandler?: MouseEventHandler;
  mouseLeaveHandler?: MouseEventHandler;
}

export const HeatmapCell: FC<HeatmapCellProps> = ({
  cellType,
  content,
  backgroundColour = GovukColours.White,
  mouseEnterHandler,
  mouseLeaveHandler,
}) => {
  switch (cellType) {
    case CellType.IndicatorTitle:
      return (
        <StyledIndicatorCell data-testid="heatmap-cell-indicator-title">
          <StyledDivIndicatorTitleCellContent>
            {content}
          </StyledDivIndicatorTitleCellContent>
        </StyledIndicatorCell>
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
      return (
        <StyledCellData
          data-testid="heatmap-cell-data"
          $color={getTextColour(backgroundColour)}
          $backgroundColor={backgroundColour}
          onMouseOver={mouseEnterHandler}
          onMouseLeave={mouseLeaveHandler}
        >
          <StyledDivDataCellContent>{content}</StyledDivDataCellContent>
        </StyledCellData>
      );
    }
  }
};
