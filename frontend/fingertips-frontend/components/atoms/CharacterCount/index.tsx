import { HintText } from 'govuk-react';

export interface CharacterCountProps {
  textLength: number;
  characterLimit?: number;
  thresholdPercentage?: number;
}

export function CharacterCount({
  textLength,
  characterLimit,
  thresholdPercentage,
}: Readonly<CharacterCountProps>) {
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
    <HintText>
      {characterLimit >= textLength
        ? `You have ${characterLimit - textLength} characters remaining.`
        : `You have ${textLength - characterLimit} characters too many`}
    </HintText>
  );
}
