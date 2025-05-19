import { Fieldset, HintText } from 'govuk-react';
import { FC, RefObject, useState } from 'react';
import { ExportPreviewCanvasDiv } from '@/components/molecules/Export/ExportPreview.styles';
import { Chart } from 'highcharts';
import { ExportType } from '@/components/molecules/Export/export.types';
import { ExportFormatRadioButtons } from '@/components/molecules/Export/ExportFormatRadioButtons';
import { ExportDownloadButton } from '@/components/molecules/Export/ExportDownloadButton';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';
import { usePreviewPrep } from '@/components/molecules/Export/usePreviewPrep';
import { DomContainer } from '@/components/molecules/Export/DomContainer';

interface ExportPreviewProps {
  targetId: string;
  chartRef?: RefObject<Chart | undefined>;
  csvData?: CsvData;
}

export const ExportPreviewOptions: FC<ExportPreviewProps> = ({
  targetId,
  chartRef,
  csvData,
}) => {
  const [format, setFormat] = useState(ExportType.PNG);

  const { element, text, isLoading } = usePreviewPrep(
    targetId,
    format,
    chartRef,
    csvData
  );

  console.log({ element, text, isLoading });

  const onChangeFormat = (format: ExportType) => {
    setFormat(format);
  };

  const availableOptions = [ExportType.PNG];
  if (chartRef?.current) availableOptions.push(ExportType.SVG);
  if (csvData) availableOptions.push(ExportType.CSV);

  return (
    <div>
      <Fieldset>
        <Fieldset.Legend size={'LARGE'}>Export options</Fieldset.Legend>
        <HintText>Select an export format</HintText>

        <ExportFormatRadioButtons
          options={availableOptions}
          selectedFormat={format}
          onChange={onChangeFormat}
        />
      </Fieldset>
      <ExportPreviewCanvasDiv>
        {format === ExportType.CSV ? (
          <pre>{text}</pre>
        ) : (
          <DomContainer data={element} />
        )}
      </ExportPreviewCanvasDiv>

      <ExportDownloadButton
        enabled={Boolean(!isLoading && (text || element))}
        baseName={targetId ?? 'download'}
        format={format}
        download={text ?? (element as HTMLCanvasElement)}
      />
    </div>
  );
};
