import { Button, Fieldset, HintText, Radio } from 'govuk-react';
import { FC, useEffect, useRef, useState } from 'react';
import { getHtmlToImageCanvas } from '@/components/molecules/Export/exportHelpers';
import {
  ExportPreviewCanvasDiv,
  FlexDiv,
} from '@/components/molecules/Export/ExportPreview.styles';

const applyCanvasToPreview = async (
  targetId: string,
  previewElement: HTMLDivElement,
  linkElement: HTMLAnchorElement
) => {
  if (!targetId || !previewElement) return;

  const canvas = await getHtmlToImageCanvas(targetId);
  if (!canvas) return;
  canvas.style.width = '100%';
  canvas.style.height = 'auto';
  previewElement.replaceChildren(canvas);
  linkElement.href = canvas.toDataURL('image/png');
};

interface ExportPreviewProps {
  targetId?: string;
}

export const ExportPreview: FC<ExportPreviewProps> = ({ targetId }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [format, setFormat] = useState('PNG');

  const onChangeFormat = (format: string) => () => {
    setFormat(format);
  };

  useEffect(() => {
    if (!previewRef.current || !targetId || !linkRef.current) return;
    void applyCanvasToPreview(targetId, previewRef.current, linkRef.current);
  }, [targetId]);

  return (
    <div>
      <Fieldset>
        <Fieldset.Legend size={'LARGE'}>Export options</Fieldset.Legend>
        <HintText>Select an export format</HintText>
        <FlexDiv>
          <Radio
            name={'exportFormat'}
            checked={format === 'PNG'}
            onChange={onChangeFormat('PNG')}
          >
            PNG
          </Radio>
          <Radio
            name={'exportFormat'}
            checked={format === 'SVG'}
            onChange={onChangeFormat('SVG')}
          >
            SVG
          </Radio>
        </FlexDiv>
      </Fieldset>
      <ExportPreviewCanvasDiv ref={previewRef}></ExportPreviewCanvasDiv>
      <a ref={linkRef} href={`#export`} download={'line-chart-download.png'}>
        <Button style={{ marginBottom: 0 }}>Export</Button>
      </a>
    </div>
  );
};
