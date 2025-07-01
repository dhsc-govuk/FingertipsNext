import {
  SearchParamKeys,
  SearchParams,
  SearchStateManager,
} from '@/lib/searchStateManager';
import { useLoadingState } from '@/context/LoaderContext';
import { usePathname, useRouter } from 'next/navigation';
import { StyledFilterSelect } from '@/components/styles/StyledFilterSelect';
import { AreaWithoutAreaType } from '@/lib/common-types';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

interface ChartSelectAreaProps {
  availableAreas: AreaWithoutAreaType[];
  chartAreaSelectedKey: SearchParamKeys;
}

export function ChartSelectArea({
  availableAreas,
  chartAreaSelectedKey,
}: Readonly<ChartSelectAreaProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();

  const searchState = useSearchStateParams();
  const searchStateManager = SearchStateManager.initialise(searchState);

  const chartAreaTypeSelected = (valueSelected: string) => {
    searchStateManager.addParamValueToState(
      chartAreaSelectedKey,
      valueSelected
    );

    const url = searchStateManager.generatePath(pathname);
    if (
      chartAreaSelectedKey === SearchParams.InequalityBarChartAreaSelected ||
      chartAreaSelectedKey === SearchParams.InequalityLineChartAreaSelected
    ) {
      history.pushState(null, '', url);
    } else {
      setIsLoading(true);
      replace(url, { scroll: false });
    }
  };

  const selectedArea =
    searchState?.[chartAreaSelectedKey] ?? availableAreas.at(0)?.code;

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
