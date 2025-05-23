import { Fieldset, HintText } from 'govuk-react';
import { FC, useState } from 'react';
import { ExportPreviewCanvasDiv } from '@/components/molecules/Export/ExportPreview.styles';
import { Options } from 'highcharts';
import { ExportType } from '@/components/molecules/Export/export.types';
import { ExportFormatRadioButtons } from '@/components/molecules/Export/ExportFormatRadioButtons';
import { ExportDownloadButton } from '@/components/molecules/Export/ExportDownloadButton';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';
import { usePreviewPrep } from '@/components/molecules/Export/usePreviewPrep';
import { DomContainer } from '@/components/atoms/DomContainer/DomContainer';

interface ExportPreviewProps {
  targetId: string;
  csvData?: CsvData;
  chartOptions?: Options;
}

export const ExportPreviewOptions: FC<ExportPreviewProps> = ({
  targetId,
  csvData,
  chartOptions,
}) => {
  const [format, setFormat] = useState(ExportType.PNG);

  const { element, text, isLoading } = usePreviewPrep(
    targetId,
    format,
    csvData,
    chartOptions
  );

  const onChangeFormat = (format: ExportType) => {
    setFormat(format);
  };

  const availableOptions = [ExportType.PNG];
  if (chartOptions) availableOptions.push(ExportType.SVG);
  if (csvData) availableOptions.push(ExportType.CSV);

  const download =
    text && text.length > 0 ? text : (element as HTMLCanvasElement);

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
        fileName={`${targetId ?? 'download'}.${format}`}
        download={download}
      />
    </div>
  );
};
