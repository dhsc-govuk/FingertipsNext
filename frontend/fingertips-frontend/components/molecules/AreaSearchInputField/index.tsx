import styled from 'styled-components';
import { InputField } from 'govuk-react';

const StyleAreaSearchBoxPanel = styled('div')({
  marginBottom: '5px',
  whiteSpace: '6',
});

export const StyleSearchHeader = styled('h3')({
  padding: '0px',
  fontSize: '19px',
});

interface SearchInputFieldProps {
  onTextChange?: (criteria: string) => void;
  value?: string;
  disabled?: boolean;
}

export const AreaSearchInputField = ({
  onTextChange,
  disabled = false,
}: SearchInputFieldProps) => {
  return (
    <StyleAreaSearchBoxPanel>
      <InputField
        input={{
          onChange: (e) => {
            const val = e.target.value;
            if (onTextChange != null) {
              onTextChange(val);
            }
          },
          disabled: disabled,
        }}
        hint={
          <div style={{ color: '#505a5f' }}>
            For example district, county, region, NHS organisation or GP
            practice or code
          </div>
        }
      >
        Search for an area
      </InputField>
    </StyleAreaSearchBoxPanel>
  );
};
