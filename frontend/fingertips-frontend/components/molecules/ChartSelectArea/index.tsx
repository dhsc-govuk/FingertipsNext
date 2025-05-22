import {
  SearchParamKeys,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { useLoadingState } from '@/context/LoaderContext';
import { usePathname, useRouter } from 'next/navigation';
import { StyledFilterSelect } from '@/components/styles/StyledFilterSelect';
import { AreaWithoutAreaType } from '@/lib/common-types';

interface ChartSelectAreaProps {
  availableAreas: AreaWithoutAreaType[];
  chartAreaSelectedKey: SearchParamKeys;
  searchState: SearchStateParams;
}

export function ChartSelectArea({
  availableAreas,
  chartAreaSelectedKey,
  searchState,
}: Readonly<ChartSelectAreaProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();

  const searchStateManager = SearchStateManager.initialise(searchState);

  const chartAreaTypeSelected = (valueSelected: string) => {
    setIsLoading(true);

    searchStateManager.addParamValueToState(
      chartAreaSelectedKey,
      valueSelected
    );

    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const selectedArea = searchState?.[chartAreaSelectedKey];

  return (
    <StyledFilterSelect
      label="Select an area"
      data-testid="chart-area-select"
      input={{
        value: selectedArea,
        onChange: (e) => chartAreaTypeSelected(e.target.value),
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
