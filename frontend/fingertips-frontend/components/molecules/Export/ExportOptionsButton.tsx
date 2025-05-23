import { FC, SyntheticEvent } from 'react';
import { Button } from 'govuk-react';
import { Options } from 'highcharts';
import { ExportPreviewOptions } from '@/components/molecules/Export/ExportPreviewOptions';
import { useModal } from '@/context/ModalContext';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';

interface ExportOptionsButtonProps {
  targetId: string;
  csvData?: CsvData;
  chartOptions?: Options;
}

export const ExportOptionsButton: FC<ExportOptionsButtonProps> = ({
  targetId,
  csvData,
  chartOptions,
}) => {
  const { setModal } = useModal();
  const onClick = (e: SyntheticEvent) => {
    e.preventDefault();

    setModal({
      content: (
        <ExportPreviewOptions
          targetId={targetId}
          csvData={csvData}
          chartOptions={chartOptions}
        />
      ),
    });
  };
  return <Button onClick={onClick}>Export options</Button>;
};
