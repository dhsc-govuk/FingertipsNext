import {
  Area,
  Header,
  HeaderType,
} from '@/components/organisms/Heatmap/heatmap.types';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

export const generateHeaders = (
  areas: Area[],
  groupAreaCode: string,
  benchmarkAreaCode: string
): Header[] => {
  const getHeaderType = (pos: number, areaCode?: string): HeaderType => {
    if (pos === 0) {
      return HeaderType.IndicatorTitle;
    }

    if (pos === 1) {
      return HeaderType.Period;
    }

    if (pos === 2) {
      return HeaderType.ValueUnit;
    }

    if (areaCode === areaCodeForEngland) {
      return benchmarkAreaCode === areaCodeForEngland
        ? HeaderType.BenchmarkGroupArea
        : HeaderType.NonBenchmarkGroupArea;
    }

    if (groupAreaCode && areaCode === groupAreaCode) {
      return benchmarkAreaCode === areaCodeForEngland
        ? HeaderType.NonBenchmarkGroupArea
        : HeaderType.BenchmarkGroupArea;
    }

    return HeaderType.Area;
  };

  const generateHeaderKey = (pos: number, areaCode?: string) => {
    const prefix = 'header';
    switch (pos) {
      case 0: {
        return `${prefix}-indicator`;
      }
      case 1: {
        return `${prefix}-period`;
      }
      case 2: {
        return `${prefix}-unitlabel`;
      }
      default: {
        return `${prefix}-${areaCode}`;
      }
    }
  };

  const generateHeaderTitle = (
    areaCode: string,
    areaName: string,
    groupAreaCode: string,
    benchmarkAreaCode: string
  ) => {
    if (areaCode !== areaCodeForEngland && areaCode !== groupAreaCode) {
      return areaName;
    }

    if (areaCode === areaCodeForEngland) {
      return benchmarkAreaCode === areaCodeForEngland
        ? `Benchmark: ${areaName}`
        : areaName;
    }

    return benchmarkAreaCode === groupAreaCode
      ? `Benchmark: ${areaName}`
      : `Group: ${areaName}`;
  };

  const constantHeaderTitles = ['Indicators', 'Period', 'Value unit'];
  return constantHeaderTitles
    .map((title, index) => {
      return {
        key: generateHeaderKey(index),
        type: getHeaderType(index),
        content: title,
      };
    })
    .concat(
      areas.map((area, index) => {
        return {
          key: generateHeaderKey(
            index + constantHeaderTitles.length,
            area.code
          ),
          content: generateHeaderTitle(
            area.code,
            area.name,
            groupAreaCode,
            benchmarkAreaCode
          ),
          type: getHeaderType(index + constantHeaderTitles.length, area.code),
        };
      })
    );
};
