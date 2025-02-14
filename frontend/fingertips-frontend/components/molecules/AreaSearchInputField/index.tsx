import styled from 'styled-components';
import { SearchBox, Label, Paragraph } from 'govuk-react';

const StyleAreaSearchBoxPanel = styled('div')({
  marginBottom: '5px',
  whiteSpace: '6',
});

const StyledSearchBoxArea = styled('div')({
  display: 'flex',
  border: '0.12em solid #000000',
});

export const StyleSearchHeader = styled('h3')({
  padding: '0px',
  fontSize: '19px',
});

const StyleSearchHintPanel = styled(Paragraph)({
  color: '#505a5f',
  fontSize: '19px;',
  marginBottom: '15px',
});

const StyleSearchBoxInput = styled(SearchBox.Input)({
  margin: '2px;',
  border: '1px',
});

interface SearchInputFieldProps {
  onTextChange?: (criteria: string) => void;
  value?: string | undefined;
  disabled?: boolean;
}

export const AreaSearchInputField = ({
  onTextChange,
  disabled = false,
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
          <StyleSearchBoxInput disabled={disabled} />
        </SearchBox>
      </StyledSearchBoxArea>
    </StyleAreaSearchBoxPanel>
  );
};
