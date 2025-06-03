import {
  HeaderCell,
  HeaderTitleWrapper,
  NonBenchmarkGroupHeaderTitle,
} from './areaHeader.styles';

interface AreaSecondaryBenchmarkHeaderProps {
  content: string;
}

export const AreaSecondaryBenchmarkHeader: React.FC<
  AreaSecondaryBenchmarkHeaderProps
> = ({ content }: AreaSecondaryBenchmarkHeaderProps) => {
  return (
    <HeaderCell>
      <HeaderTitleWrapper>
        <NonBenchmarkGroupHeaderTitle>{content}</NonBenchmarkGroupHeaderTitle>
      </HeaderTitleWrapper>
    </HeaderCell>
  );
};
