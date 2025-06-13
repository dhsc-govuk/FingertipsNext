import { SearchParamKeys, SearchStateManager } from '@/lib/searchStateManager';
import { useLoadingState } from '@/context/LoaderContext';
import { usePathname, useRouter } from 'next/navigation';
import { StyledFilterSelect } from '@/components/styles/StyledFilterSelect';
import { AreaWithoutAreaType } from '@/lib/common-types';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

interface BenchmarkSelectAreaProps {
  availableAreas: AreaWithoutAreaType[];
  benchmarkAreaSelectedKey: SearchParamKeys;
}

export function BenchmarkSelectArea({
  availableAreas,
  benchmarkAreaSelectedKey,
}: Readonly<BenchmarkSelectAreaProps>) {
  const searchState = useSearchStateParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();

  const searchStateManager = SearchStateManager.initialise(searchState);

  const onBenchmarkAreaSelected = (valueSelected: string) => {
    setIsLoading(true);

    searchStateManager.addParamValueToState(
      benchmarkAreaSelectedKey,
      valueSelected
    );

    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const selectedArea =
    searchState?.[benchmarkAreaSelectedKey] ?? areaCodeForEngland;

  return (
    <StyledFilterSelect
      label="Select a benchmark"
      data-testid={`${benchmarkAreaSelectedKey}-dropDown-benchmark-component`}
      input={{
        value: selectedArea,
        onChange: (e) => onBenchmarkAreaSelected(e.target.value),
      }}
    >
      {availableAreas?.map((area) => (
        <option key={area.code} value={area.code}>
          {area.name}
        </option>
      ))}
    </StyledFilterSelect>
  );
}
