import { Checkbox, Paragraph } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';

const StyledParagraph = styled(Paragraph)(
  spacing.withWhiteSpace({
    margin: [{ size: 0 }],
  })
);

type ConfidenceIntervalCheckboxProps = {
  chartName: string;
  confidenceIntervalSelected: boolean;
  handleSetConfidenceIntervalSelected: Dispatch<SetStateAction<boolean>>;
};

export function ConfidenceIntervalCheckbox({
  chartName,
  confidenceIntervalSelected,
  handleSetConfidenceIntervalSelected,
}: Readonly<ConfidenceIntervalCheckboxProps>) {
  return (
    <Checkbox
      id={`confidence-interval-checkbox-${chartName}`}
      data-testid={`confidence-interval-checkbox-${chartName}`}
      name="confidence-interval-checkbox"
      onChange={(e) => {
        handleSetConfidenceIntervalSelected(e.target.checked);
      }}
      defaultChecked={confidenceIntervalSelected}
      sizeVariant="SMALL"
    >
      <StyledParagraph>Show confidence intervals</StyledParagraph>
    </Checkbox>
  );
}
