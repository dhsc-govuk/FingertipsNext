import {
  StyledCellHeaderArea,
  StyledDiv,
  StyledH4SecondaryBenchmarkHeader,
} from './areaHeader.styles';

interface AreaSecondaryBenchmarkHeaderProps {
  content: string;
}

export const AreaSecondaryBenchmarkHeader: React.FC<
  AreaSecondaryBenchmarkHeaderProps
> = ({ content }: AreaSecondaryBenchmarkHeaderProps) => {
  return (
    <StyledCellHeaderArea>
      <StyledDiv>
        <StyledH4SecondaryBenchmarkHeader>
          {content}
        </StyledH4SecondaryBenchmarkHeader>
      </StyledDiv>
    </StyledCellHeaderArea>
  );
};
