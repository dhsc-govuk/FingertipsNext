import { GovukColours } from '@/lib/styleHelpers/colours';
import { H4, Table } from 'govuk-react';
import { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  HeaderType,
  heatmapDataColumnWidth,
  heatmapIndicatorTitleColumnWidth,
} from './heatmapUtil';

const StyledDivRotate = styled.div({
  position: 'relative',
  height: '50px',
  h4: {
    top: 0,
    left: 0,
    padding: '4px 8px',
    transformOrigin: 'top left',
  },
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

const rotatingHeaders = [
  HeaderType.BenchmarkArea,
  HeaderType.GroupArea,
  HeaderType.Area,
];

export const HeatmapHeader: FC<HeatmapHeaderProps> = ({
  headerType,
  content,
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const widthRef = useRef(0);

  useEffect(() => {
    if (widthRef.current) return; // do all this only once
    if (!elementRef.current) return;
    const element = elementRef.current;
    const heading = element.querySelector('h4');
    if (!heading) return;
    const width = heading.clientWidth;
    if (!widthRef.current) widthRef.current = width;
    if (!rotatingHeaders.includes(headerType)) return;

    heading.style.position = 'absolute';
    heading.style.transform = 'translate(-10px, 15px) rotate(-60deg)';
    const minHeight = Math.cos(Math.PI / 6) * width;
    element.style.height = `${minHeight + 40}px`;

    const tr = element.closest('tr');
    const isLastInRow = element === tr?.lastElementChild;
    console.log({ content, isLastInRow });
    if (!isLastInRow) return;

    const table = tr.closest('table') as HTMLTableElement;

    const horizontalOverlap = Math.sin(Math.PI / 6) * width;
    console.log({ horizontalOverlap });
    table.style.marginRight = '100px';
  }, [headerType, content]);

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
        <StyledCellHeaderArea ref={elementRef}>
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
        <StyledCellHeaderArea ref={elementRef}>
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
        <StyledCellHeaderArea ref={elementRef}>
          <StyledDivRotate>
            <StyledH4AreaScaled>{content}</StyledH4AreaScaled>
          </StyledDivRotate>
        </StyledCellHeaderArea>
      );
  }
};
