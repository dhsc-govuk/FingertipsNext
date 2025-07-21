import { SearchParamKeys, SearchStateManager } from '@/lib/searchStateManager';
import { usePathname } from 'next/navigation';
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
  const searchState = useSearchStateParams();
  const searchStateManager = SearchStateManager.initialise(searchState);

  const chartAreaTypeSelected = (valueSelected: string) => {
    searchStateManager.addParamValueToState(
      chartAreaSelectedKey,
      valueSelected
    );

    const url = searchStateManager.generatePath(pathname);
    history.pushState(null, '', url);
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
