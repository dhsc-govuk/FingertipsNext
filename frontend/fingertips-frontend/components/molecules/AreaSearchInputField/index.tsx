import styled from 'styled-components';
import { SearchBox, Label } from 'govuk-react';

const StyleAreaSearchBoxPanel = styled('div')({
  marginBottom: '5px',
  whiteSpace: '6',
});

const StyledSearchBoxArea = styled('div')({
  display: 'flex',
  border: '0.12em solid #000000',
});

export const StyleSearchHeader = styled(Label)({
  padding: '0px',
  color: '#0b0c0c',
  display: 'block',
  clear: 'none',
  paddingBottom: '2px',
  fontWeight: '400',
  fontSize: '19px',
  fontFamily: '"nta", Arial, sans-serif;',
  textAlign: 'left',
});

const StyleSearchHintPanel = styled('div')({
  color: '#505a5f',
  fontSize: '19px;',
  lineHeight: '1.3157894736842106;',
  fontFamily: '"nta", Arial, sans-serif;',
  marginBottom: '15px',
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
      <StyleSearchHeader>Search for an area</StyleSearchHeader>
      <StyleSearchHintPanel>
        For example district, county, region, NHS organisation or GP practice or
        code
      </StyleSearchHintPanel>

      <StyledSearchBoxArea>
        <SearchBox
          onChange={(e) => {
            const value = e.target.value;
            if (onTextChange != null) {
              onTextChange(value);
            }
          }}
        >
          <SearchBox.Input />
          <SearchBox.Button />
        </SearchBox>
      </StyledSearchBoxArea>
    </StyleAreaSearchBoxPanel>
  );
};
