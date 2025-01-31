// TODO: Add tests
// TODO: conditional imports?
import regionsMap from '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import countiesAndUAsMap from '@/assets/maps/Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BSC_4952317392296043005.geo.json';
import districtsAndUAsMap from '@/assets/maps/Local_Authority_Districts_May_2024_Boundaries__UK_BSC_-5684348521832897108.geo.json';
import NHSRegionsMap from '@/assets/maps/NHS_England_Regions_January_2024_EN_BSC_7500404208533377417.geo.json';
import NHSICBMap from '@/assets/maps/Integrated_Care_Boards_April_2023_EN_BSC_-187828753279616787.geo.json';
import NHSSubICBMap from '@/assets/maps/NHS_SubICB_April_2023_EN_BSC_8040841744469859785.geo.json';
import { GeoJSON } from 'highcharts';

const mapEncoder: Record<string, GeoJSON> = {
  'Regions Statistical': regionsMap,
  'Counties & UAs': countiesAndUAsMap,
  'Districts & UAs': districtsAndUAsMap,
  // TODO: add CA map
  'NHS region': NHSRegionsMap,
  'ICB': NHSICBMap,
  'Sub ICB': NHSSubICBMap,
};

export function getMapFile(areaType: string): GeoJSON {
  return mapEncoder[areaType];
}
