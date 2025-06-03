import {
  StyledCellHeaderArea,
  StyledDiv,
  StyledH4PrimaryBenchmarkHeader,
} from './areaHeader.styles';

interface AreaPrimaryBenchmarkHeaderProps {
  content: string;
}

export const AreaPrimaryBenchmarkHeader: React.FC<
  AreaPrimaryBenchmarkHeaderProps
> = ({ content }: AreaPrimaryBenchmarkHeaderProps) => {
  return (
    <StyledCellHeaderArea>
      <StyledDiv>
        <StyledH4PrimaryBenchmarkHeader>
          {content}
        </StyledH4PrimaryBenchmarkHeader>
      </StyledDiv>
    </StyledCellHeaderArea>
  );
};
