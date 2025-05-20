import { HintText } from 'govuk-react';
import styled from 'styled-components';

export interface CharacterCountProps {
  textLength: number;
  characterLimit?: number;
  thresholdPercentage?: number;
}

const StyledHintText = styled(HintText)({
  position: 'absolute',
});

export function CharacterCount({
  textLength,
  characterLimit,
  thresholdPercentage,
}: CharacterCountProps) {
  if (!characterLimit || characterLimit < 1) {
    return null;
  }

  if (thresholdPercentage && thresholdPercentage > 100) {
    return null;
  }

  if (
    thresholdPercentage &&
    (textLength / characterLimit) * 100 <= thresholdPercentage
  ) {
    return null;
  }

  return (
    <StyledHintText>
      {characterLimit >= textLength
        ? `You have ${characterLimit - textLength} characters remaining.`
        : `You have ${textLength - characterLimit} characters too many`}
    </StyledHintText>
  );
}
