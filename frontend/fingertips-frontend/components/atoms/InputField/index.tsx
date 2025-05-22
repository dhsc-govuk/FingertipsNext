import { InputField as GovukInputField } from 'govuk-react';
import { InputFieldProps as GovukInputFieldProps } from '@govuk-react/input-field';
import { ChangeEventHandler, useState } from 'react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { CharacterCount } from '../CharacterCount';

interface InputFieldProps extends GovukInputFieldProps {
  characterLimit?: number;
  thresholdPercentage?: number;
}

const StyledInputField = styled(GovukInputField)(
  spacing.withWhiteSpace({ marginBottom: 1 })
);

const StyledPositionDiv = styled.div({
  position: 'absolute',
});

const StyledPaddingDiv = styled.div({ paddingBottom: '30px' });

export function InputField(props: Readonly<InputFieldProps>) {
  const { characterLimit, thresholdPercentage, input } = props;

  const [inputTextLength, setInputTextLength] = useState(
    input?.defaultValue?.toString().length ?? 0
  );
  const existingOnChangeHandler = input?.onChange;
  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (existingOnChangeHandler !== undefined) {
      existingOnChangeHandler(e);
    }

    setInputTextLength(e.target.value.length);
  };

  return (
    <StyledPaddingDiv>
      <StyledInputField
        {...props}
        input={{
          ...input,
          maxLength: characterLimit ?? input?.maxLength,
          onChange: characterLimit ? onChangeHandler : existingOnChangeHandler,
        }}
      >
        {props.children}
      </StyledInputField>
      <StyledPositionDiv>
        <CharacterCount
          textLength={inputTextLength}
          characterLimit={characterLimit}
          thresholdPercentage={thresholdPercentage}
        />
      </StyledPositionDiv>
    </StyledPaddingDiv>
  );
}
