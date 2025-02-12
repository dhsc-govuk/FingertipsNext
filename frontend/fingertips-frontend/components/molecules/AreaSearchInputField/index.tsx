import styled from 'styled-components';
import { SearchBox } from 'govuk-react';

const MIN_SEARCH_SIZE = 3;

const StyleAreaSearchBoxPanel = styled('div')({
  marginBottom: '5px',
  whiteSpace: '6',
});

const StyledSearchBoxArea = styled('div')({
  display: 'flex',
  border: '0.12em solid #000000',
});
interface SearchInputFieldProps {
  onTextChange?: (criteria: string) => void;
  value?: string | undefined;
}

export const AreaSearchInputField = ({
  value,
  onTextChange,
}: SearchInputFieldProps) => {
  return (
    <StyleAreaSearchBoxPanel>
      <h3>Search for an area</h3>
      <div style={{ color: '#505a5f' }}>
        For example postcode, county, local authority, NHS Trust or General
        Practice name or code
      </div>

      <StyledSearchBoxArea>
        <SearchBox
          onChange={(e) => {
            const value = e.target.value;
            if (MIN_SEARCH_SIZE <= value.length && onTextChange != null) {
              onTextChange(value);
            }
          }}
        >
          <SearchBox.Input placeholder="Search GOV.UK" />
          <SearchBox.Button />
        </SearchBox>
      </StyledSearchBoxArea>
    </StyleAreaSearchBoxPanel>
  );
};
