import {
  HeaderCell,
  HeaderTitleWrapper,
  BenchmarkGroupHeaderTitle,
} from './areaHeader.styles';

interface AreaPrimaryBenchmarkHeaderProps {
  content: string;
}

export const AreaPrimaryBenchmarkHeader: React.FC<
  AreaPrimaryBenchmarkHeaderProps
> = ({ content }: AreaPrimaryBenchmarkHeaderProps) => {
  return (
    <HeaderCell data-testid="heatmap-header-benchmark-group">
      <HeaderTitleWrapper>
        <BenchmarkGroupHeaderTitle>{content}</BenchmarkGroupHeaderTitle>
      </HeaderTitleWrapper>
    </HeaderCell>
  );
};
