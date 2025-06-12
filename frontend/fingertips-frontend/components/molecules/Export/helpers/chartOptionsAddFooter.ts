import { CustomOptions } from '@/components/molecules/Export/export.types';
import {
  exportAccessedDate,
  exportCopyrightText,
} from '@/components/molecules/Export/ExportCopyright';
import {
  mapCopyright,
  mapLicense,
  mapSourceForType,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';

export const chartOptionsAddFooter = (options: CustomOptions) => {
  const modifiedEvents = { ...options.chart?.events };
  const modifiedChart = { ...options.chart, events: modifiedEvents };
  const modifiedOptions = { ...options, chart: modifiedChart };

  const captionLines = [exportCopyrightText(), exportAccessedDate()];

  if (modifiedOptions.custom?.mapAreaType) {
    const mapSource = mapSourceForType(modifiedOptions.custom?.mapAreaType);
    captionLines.push('');
    captionLines.push(mapSource);
    captionLines.push(mapLicense);
    captionLines.push(mapCopyright);
  }

  modifiedOptions.caption = {
    margin: 20,
    text: captionLines.join('<br />'),
    style: {
      color: GovukColours.Black,
      fontSize: '14px',
    },
  };
  modifiedOptions.chart.spacingBottom = 25;
  return modifiedOptions;
};
