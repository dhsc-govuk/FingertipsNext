import { AreaDocument } from '@/lib/search/searchTypes';
import { Select } from 'govuk-react';
import styled from 'styled-components';

const StyledAreaSelectInputField = styled(Select)({
  span: {
    fontWeight: 'bold',
  },
  select: {
    width: '100%',
  },
  marginBottom: '25px',
});

interface AreaSelectInputFieldProps {
  selectedAreaCode?: string;
  onSelected?: (area: Omit<AreaDocument, 'areaType'>) => void;
  areas: Omit<AreaDocument, 'areaType'>[];
  title: string;
}

export const AreaSelectInputField = ({
  areas,
  selectedAreaCode,
  onSelected,
  title,
}: AreaSelectInputFieldProps) => {
  return (
    <StyledAreaSelectInputField
      label={title}
      data-testid="area-type-selector-container-pyramid"
      input={{
        onChange: (e) => {
          e.preventDefault();
          if (onSelected) {
            const selectedArea = areas.find(
              (area: Omit<AreaDocument, 'areaType'>, _: number) => {
                return area.areaCode == e.target.value;
              }
            );
            if (selectedArea) onSelected(selectedArea);
          }
        },
        defaultValue: selectedAreaCode,
      }}
    >
      {areas.map((area: Omit<AreaDocument, 'areaType'>) => {
        return (
          <option
            value={area.areaCode}
            key={`${area.areaName}-${area.areaCode}`}
          >
            {area.areaName}
          </option>
        );
      })}
    </StyledAreaSelectInputField>
  );
};
