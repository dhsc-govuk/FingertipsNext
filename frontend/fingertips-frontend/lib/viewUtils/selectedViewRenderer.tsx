import { OnceIndicatorOneAreaDashboard } from '@/components/dashboards/OnceIndicatorOneAreaDashboard';
import { EnglandView } from '@/components/dashboards/EnglandView';
import { ThreeOrMoreAreasView } from '@/components/dashboards/ThreeOrMoreAreasView';
import { TwoAreasView } from '@/components/dashboards/TwoAreasView';

export function selectedViewRenderer(
  selectedView: string,
  areaCodes: string[],
  indicatorsSelected: string[]
) {
  switch (selectedView) {
    case 'oneAreaView':
      return (
        <OnceIndicatorOneAreaDashboard
          areaCodes={areaCodes}
          indicatorsSelected={indicatorsSelected}
        />
      );
    case 'twoAreasView':
      return (
        <TwoAreasView
          areaCodes={areaCodes}
          indicatorsSelected={indicatorsSelected}
        />
      );
    case 'threeOrMoreAreasView':
      return (
        <ThreeOrMoreAreasView
          areaCodes={areaCodes}
          indicatorsSelected={indicatorsSelected}
        />
      );
    case 'englandView':
      return (
        <EnglandView
          areaCodes={areaCodes}
          indicatorsSelected={indicatorsSelected}
        />
      );
  }
}
