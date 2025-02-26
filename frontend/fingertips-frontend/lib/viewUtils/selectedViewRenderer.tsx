import { OneAreaView } from '@/components/views/OneAreaView';
import { EnglandView } from '@/components/views/EnglandView';
import { ThreeOrMoreAreasView } from '@/components/views/ThreeOrMoreAreasView';
import { TwoAreasView } from '@/components/views/TwoAreasView';

export function selectedViewRenderer(
  selectedView: string,
  areaCodes: string[],
  indicatorsSelected: string[]
) {
  switch (selectedView) {
    case 'oneAreaView':
      return (
        <OneAreaView
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
