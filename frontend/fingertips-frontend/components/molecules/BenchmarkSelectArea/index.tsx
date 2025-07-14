import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { useLoadingState } from '@/context/LoaderContext';
import { usePathname, useRouter } from 'next/navigation';
import { StyledFilterSelect } from '@/components/styles/StyledFilterSelect';
import { AreaWithoutAreaType } from '@/lib/common-types';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

interface BenchmarkSelectAreaProps {
  availableAreas: AreaWithoutAreaType[];
}

export function BenchmarkSelectArea({
  availableAreas,
}: Readonly<BenchmarkSelectAreaProps>) {
  const searchState = useSearchStateParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();

  const searchStateManager = SearchStateManager.initialise(searchState);

  const onBenchmarkAreaSelected = (
    valueSelected: string,
    previousSelectedArea: string
  ) => {
    if (valueSelected === previousSelectedArea) return;

    setIsLoading(true);

    searchStateManager.addParamValueToState(
      SearchParams.BenchmarkAreaSelected,
      valueSelected
    );

    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const selectedArea =
    searchState?.[SearchParams.BenchmarkAreaSelected] ?? areaCodeForEngland;

  return (
    <StyledFilterSelect
      label="Select a benchmark for all charts"
      data-testid={`${SearchParams.BenchmarkAreaSelected}-dropDown-benchmark-component`}
      input={{
        value: selectedArea,
        onChange: (e) => onBenchmarkAreaSelected(e.target.value, selectedArea),
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
