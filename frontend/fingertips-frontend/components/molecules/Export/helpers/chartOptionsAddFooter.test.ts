import { chartOptionsAddFooter } from '@/components/molecules/Export/helpers/chartOptionsAddFooter';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  exportAccessedDate,
  exportCopyrightText,
} from '@/components/molecules/Export/ExportCopyright';
import { CustomOptions } from '@/components/molecules/Export/export.types';
import { mapSourceForType } from '@/components/organisms/ThematicMap/thematicMapHelpers';

describe('chartOptionsAddFooter', () => {
  it('modifies chart options and attaches a load event', () => {
    const inputOptions = {
      chart: {
        events: {},
      },
    };

    const modified = chartOptionsAddFooter(inputOptions);

    expect(modified.chart.spacingBottom).toBe(25);
    expect(modified.caption).toEqual({
      margin: 20,
      style: {
        color: GovukColours.Black,
        fontSize: '14px',
      },
      text: `${exportCopyrightText()}<br />${exportAccessedDate()}`,
    });
  });

  it('includes map metadata when custom.mapAreaType is set', () => {
    const inputOptions = {
      chart: {
        events: {},
      },
      custom: {
        mapAreaType: 'regions',
      },
    } as CustomOptions;

    const modified = chartOptionsAddFooter(inputOptions);
    expect(modified.caption?.text).toContain(mapSourceForType('regions'));
  });
});
