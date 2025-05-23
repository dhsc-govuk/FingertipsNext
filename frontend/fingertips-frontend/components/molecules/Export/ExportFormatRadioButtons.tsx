import { Radio } from 'govuk-react';
import { ExportType } from '@/components/molecules/Export/export.types';
import { FlexDiv } from '@/components/molecules/Export/ExportPreview.styles';
import { FC } from 'react';

interface ExportFormatRadioButtonsProps {
  selectedFormat: ExportType;
  onChange: (format: ExportType) => void;
  options: ExportType[];
}

export const ExportFormatRadioButtons: FC<ExportFormatRadioButtonsProps> = ({
  selectedFormat,
  onChange,
  options,
}) => {
  const onChangeSelected = (format: ExportType) => () => {
    onChange(format);
  };

  return (
    <FlexDiv>
      {options.map((format) => (
        <Radio
          key={format}
          name={'exportFormat'}
          checked={selectedFormat === format}
          onChange={onChangeSelected(format)}
        >
          {format.toUpperCase()}
        </Radio>
      ))}
    </FlexDiv>
  );
};
