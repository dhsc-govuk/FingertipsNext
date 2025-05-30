import { FC, SyntheticEvent } from 'react';
import { Button } from 'govuk-react';
import { ExportPreviewOptions } from '@/components/molecules/Export/ExportPreviewOptions';
import { useModal } from '@/context/ModalContext';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';
import styled from 'styled-components';
import { CustomOptions } from '@/components/molecules/Export/export.types';

const ButtonWithMargin = styled(Button)({ marginTop: '1rem' });

interface ExportOptionsButtonProps {
  targetId: string;
  csvData?: CsvData;
  chartOptions?: CustomOptions;
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
  return <ButtonWithMargin onClick={onClick}>Export options</ButtonWithMargin>;
};
