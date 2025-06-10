import {
  HeaderCell,
  HeaderTitleWrapper,
  NonBenchmarkGroupHeaderTitle,
} from './AreaHeader.styles';

interface AreaSecondaryBenchmarkHeaderProps {
  content: string;
}

export const AreaSecondaryBenchmarkHeader: React.FC<
  AreaSecondaryBenchmarkHeaderProps
> = ({ content }: AreaSecondaryBenchmarkHeaderProps) => {
  return (
    <HeaderCell data-testid="heatmap-header-non-benchmark-group">
      <HeaderTitleWrapper>
        <NonBenchmarkGroupHeaderTitle>{content}</NonBenchmarkGroupHeaderTitle>
      </HeaderTitleWrapper>
    </HeaderCell>
  );
};
