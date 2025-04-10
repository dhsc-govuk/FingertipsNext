import {
  SearchParamKeys,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { useLoadingState } from '@/context/LoaderContext';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Select } from 'govuk-react';
import { AreaWithoutAreaType } from '@/components/organisms/Inequalities/inequalitiesHelpers';

interface ChartSelectAreaProps {
  availableAreas: AreaWithoutAreaType[];
  chartAreaSelectedKey: SearchParamKeys;
  searchState: SearchStateParams;
}

const StyledFilterSelect = styled(Select)({
  span: {
    fontWeight: 'bold',
  },
  select: {
    width: '100%',
  },
  marginBottom: '2em',
});

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
