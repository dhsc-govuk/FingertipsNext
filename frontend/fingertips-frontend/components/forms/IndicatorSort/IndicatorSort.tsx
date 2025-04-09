import { Select } from 'govuk-react';
import {
  SortOrderKeys,
  sortOrderLabels,
} from '@/components/forms/IndicatorSort/indicatorSort.types';
import { ChangeEventHandler, FC } from 'react';
import styled from 'styled-components';

interface IndicatorSortProps {
  selectedSortOrder: SortOrderKeys;
  onChange: ChangeEventHandler<HTMLSelectElement>;
}

const StyledDiv = styled.div({
  marginBottom: '1.5rem',
});

export const IndicatorSort: FC<IndicatorSortProps> = ({
  selectedSortOrder,
  onChange,
}) => {
  return (
    <StyledDiv>
      <Select label="Sort by" input={{ onChange, value: selectedSortOrder }}>
        {Object.keys(SortOrderKeys).map((key) => (
          <option key={key} value={key}>
            {sortOrderLabels[key as keyof typeof SortOrderKeys]}
          </option>
        ))}
      </Select>
    </StyledDiv>
  );
};
