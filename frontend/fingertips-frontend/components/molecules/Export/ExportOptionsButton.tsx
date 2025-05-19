import { FC, RefObject, SyntheticEvent } from 'react';
import { Button } from 'govuk-react';
import { Chart } from 'highcharts';
import { ExportPreviewOptions } from '@/components/molecules/Export/ExportPreviewOptions';
import { useModal } from '@/context/ModalContext';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';

interface ExportOptionsButtonProps {
  targetId: string;
  chartRef?: RefObject<Chart | undefined>;
  csvData?: CsvData;
}

export const ExportOptionsButton: FC<ExportOptionsButtonProps> = ({
  targetId,
  chartRef,
  csvData,
}) => {
  const { setModal } = useModal();
  const onClick = (e: SyntheticEvent) => {
    e.preventDefault();

    setModal({
      content: (
        <ExportPreviewOptions
          targetId={targetId}
          chartRef={chartRef}
          csvData={csvData}
        />
      ),
    });
  };
  return <Button onClick={onClick}>Export options</Button>;
};
