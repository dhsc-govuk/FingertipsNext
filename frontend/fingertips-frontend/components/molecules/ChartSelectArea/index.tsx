import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchState } from '@/context/SearchStateContext';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Select } from 'govuk-react';
import { AreaWithoutAreaType } from '@/components/organisms/Inequalities/inequalitiesHelpers';

interface ChartSelectAreaProps {
  availableAreas: AreaWithoutAreaType[];
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
}: Readonly<ChartSelectAreaProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();

  const searchStateManager = SearchStateManager.initialise(searchState);

  const chartAreaTypeSelected = (valueSelected: string) => {
    setIsLoading(true);

    searchStateManager.addParamValueToState(
      SearchParams.InequalityBarChartAreaSelected,
      valueSelected
    );

    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const selectedArea =
    searchState?.[SearchParams.InequalityBarChartAreaSelected];

  return (
    <>
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
    </>
  );
}
