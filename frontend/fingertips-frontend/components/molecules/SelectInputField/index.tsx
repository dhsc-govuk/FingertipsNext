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

export interface AreaSelectInputData {
  areaCode: string;
  areaName: string;
}
interface AreaSelectInputFieldProps {
  selectedAreaCode?: string;
  onSelected?: (area: AreaSelectInputData) => void;
  areas: AreaSelectInputData[];
  title: string;
  visibility?: boolean;
}

export const AreaSelectInputField = ({
  areas,
  selectedAreaCode,
  onSelected,
  title,
  visibility = true,
}: AreaSelectInputFieldProps) => {
  if (!visibility) return <></>;
  return (
    <StyledAreaSelectInputField
      label={title}
      data-testid="area-type-selector-container-pyramid"
      input={{
        onChange: (e) => {
          e.preventDefault();
          if (onSelected) {
            const selectedArea = areas.find(
              (area: AreaSelectInputData, _: number) => {
                return area.areaCode == e.target.value;
              }
            );
            if (selectedArea) onSelected(selectedArea);
          }
        },
        defaultValue: selectedAreaCode,
      }}
    >
      {areas.map((area: AreaSelectInputData) => {
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
