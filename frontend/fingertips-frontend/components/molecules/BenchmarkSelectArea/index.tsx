import {
  SearchParamKeys,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { useLoadingState } from '@/context/LoaderContext';
import { usePathname, useRouter } from 'next/navigation';
import { StyledFilterSelect } from '@/components/styles/StyledFilterSelect';
import { AreaWithoutAreaType } from '@/lib/common-types';

interface BenchmarkSelectAreaProps {
  availableAreas: AreaWithoutAreaType[];
  benchmarkAreaSelectedKey: SearchParamKeys;
  searchState: SearchStateParams;
}

export function BenchmarkSelectArea({
  availableAreas,
  benchmarkAreaSelectedKey,
  searchState,
}: Readonly<BenchmarkSelectAreaProps>) {
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

  const selectedArea = searchState?.[benchmarkAreaSelectedKey];

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
