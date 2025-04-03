// describe('generateThematicMapTooltipString', () => {
//   const mockHcPoint = {
//     areaName: 'area',
//     year: 2004,
//     benchmarkComparisonOutcome: BenchmarkOutcome.Better,
//     value: 10,
//   };

//   const mockGroupDataForYear: HealthDataForArea = {
//     ...mockHealthData[108][1],
//     healthData: [
//       {
//         ...mockHealthData[108][1].healthData[0],
//         benchmarkComparison: { outcome: 'Worse' },
//       },
//     ],
//   };

//   const mockBenchmarkDataForYear: HealthDataForArea = {
//     ...mockHealthData[108][0],
//     healthData: [
//       {
//         ...mockHealthData[108][1].healthData[0],
//         benchmarkComparison: { outcome: 'Worse' },
//       },
//     ],
//   };

//   const expectedAreaTooltip =
//     `<br /><span style="font-weight: bold">${mockHcPoint.areaName}</span>` +
//     `<br /><span>${mockHcPoint.year}</span>` +
//     `<br /><span style="color: ${GovukColours.Green}; font-size: large;">${symbolEncoder.circle}</span>` +
//     `<span>${mockHcPoint.value} mock units</span>` +
//     `<br /><span>${mockHcPoint.benchmarkComparisonOutcome} than England</span><br /><span>(95%)</span>`;

//   const expectedGroupTooltip =
//     `<br /><span style=\"font-weight: bold\">Group: ${mockGroupDataForYear.areaName}</span>` +
//     `<br /><span>${mockGroupDataForYear.healthData[0].year}</span><br />` +
//     `<span style=\"color: ${GovukColours.Red}; font-size: large;\">${symbolEncoder.diamond}</span>` +
//     `<span>${mockGroupDataForYear.healthData[0].value} mock units</span>` +
//     `<br /><span>${mockGroupDataForYear.healthData[0].benchmarkComparison?.outcome} than England</span><br /><span>(95%)</span>`;

//   const expectedBenchmarkTooltip =
//     `<span style=\"font-weight: bold\">Benchmark: ${mockBenchmarkDataForYear.areaName}</span>` +
//     `<br /><span>${mockBenchmarkDataForYear.healthData[0].year}</span><br />` +
//     `<span style=\"color: ${GovukColours.Black}; font-size: large;\">${symbolEncoder.circle}</span>` +
//     `<span>${mockBenchmarkDataForYear.healthData[0].value} mock units</span>`;

//   it('should return the expected tooltip for an area', () => {
//     const actual = generateThematicMapTooltipString(
//       mockHcPoint,
//       undefined,
//       undefined,
//       BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
//       IndicatorPolarity.Unknown,
//       'mock units'
//     );
//     expect(actual).toEqual(expectedAreaTooltip);
//   });
//   it.skip('should return the expected tooltip for an area which is "not compared"', () => {
//     const mockHcPoint = {
//       areaName: 'area',
//       year: 1979,
//       benchmarkComparisonOutcome: BenchmarkOutcome.NotCompared,
//       value: 10,
//     };
//     const actual = generateThematicMapTooltipString(
//       mockHcPoint,
//       undefined,
//       undefined,
//       BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
//       IndicatorPolarity.Unknown,
//       'mock units'
//     );
//     const expectedAreaToolTip =
//       `<br /><span style="font-weight: bold">${mockHcPoint.areaName}</span>` +
//       `<br /><span>${mockHcPoint.year}</span>` +
//       `<br /><span style="color: ${GovukColours.Black}; font-size: large;">${symbolEncoder.multiplicationX}</span>` +
//       `<span>${mockHcPoint.value} mock units</span>` +
//       `<br /><span>${mockHcPoint.benchmarkComparisonOutcome} than England</span><br /><span>(95%)</span>`;
//     expect(actual).toEqual(expectedAreaToolTip);
//   });
//   it('should return the expected tooltip for an area and group', () => {
//     const actual = generateThematicMapTooltipString(
//       mockHcPoint,
//       undefined,
//       mockGroupDataForYear,
//       BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
//       IndicatorPolarity.Unknown,
//       'mock units'
//     );
//     expect(actual).toEqual(expectedGroupTooltip + expectedAreaTooltip);
//   });
//   it('should return the expected tooltip for an area and group for an area where benchmarking outcome is "not compared"', () => {
//     const mockGroupDataForYear: HealthDataForArea = {
//       ...mockHealthData[108][1],
//       healthData: [
//         {
//           ...mockHealthData[108][1].healthData[0],
//           benchmarkComparison: { outcome: 'NotCompared' },
//         },
//       ],
//     };

//     const expectedGroupTooltip =
//       `<br /><span style=\"font-weight: bold\">Group: ${mockGroupDataForYear.areaName}</span>` +
//       `<br /><span>${mockGroupDataForYear.healthData[0].year}</span><br />` +
//       `<span style=\"color: ${GovukColours.Black}; font-size: large;\">${symbolEncoder.multiplicationX}</span>` +
//       `<span>${mockGroupDataForYear.healthData[0].value} mock units</span>` +
//       `<br /><span>${mockGroupDataForYear.healthData[0].benchmarkComparison?.outcome} than England</span><br /><span>(95%)</span>`;

//     const actual = generateThematicMapTooltipString(
//       mockHcPoint,
//       undefined,
//       mockGroupDataForYear,
//       BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
//       IndicatorPolarity.Unknown,
//       'mock units'
//     );
//     expect(actual).toEqual(expectedGroupTooltip + expectedAreaTooltip);
//   });
//   it('should return the expected tootip for an area and benchmark', () => {
//     const actual = generateThematicMapTooltipString(
//       mockHcPoint,
//       mockBenchmarkDataForYear,
//       undefined,
//       BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
//       IndicatorPolarity.Unknown,
//       'mock units'
//     );
//     expect(actual).toEqual(expectedBenchmarkTooltip + expectedAreaTooltip);
//   });
//   it('should return the expected tootip for an area, group and benchmark', () => {
//     const actual = generateThematicMapTooltipString(
//       mockHcPoint,
//       mockBenchmarkDataForYear,
//       mockGroupDataForYear,
//       BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
//       IndicatorPolarity.Unknown,
//       'mock units'
//     );
//     expect(actual).toEqual(
//       expectedBenchmarkTooltip + expectedGroupTooltip + expectedAreaTooltip
//     );
//   });
// });

describe(generateBenchmarkTooltipForArea, () => {
  const mockThematicMapPointRAG = {
    areaName: 'mockarea',
    year: 2004,
    benchmarkComparisonOutcome: BenchmarkOutcome.Better,
    value: 10,
  };

  const mockUnits = 'Mpa';
  const mockBenchmarkArea = 'England';

  it.each([
    [
      BenchmarkOutcome.NotCompared,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      symbolEncoder.multiplicationX,
      '',
    ],
    [
      BenchmarkOutcome.Better,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      symbolEncoder.circle,
      `than ${mockBenchmarkArea}`,
    ],
    [
      BenchmarkOutcome.Similar,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      symbolEncoder.circle,
      `to ${mockBenchmarkArea}`,
    ],
    [
      BenchmarkOutcome.Worse,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      symbolEncoder.circle,
      `than ${mockBenchmarkArea}`,
    ],
    [
      BenchmarkOutcome.Lower,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      symbolEncoder.circle,
      `than ${mockBenchmarkArea}`,
    ],
    [
      BenchmarkOutcome.Higher,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      symbolEncoder.circle,
      `than ${mockBenchmarkArea}`,
    ],
  ])(
    'should return the expected RAG tooltip for an area',
    (
      testBenchmarkOutcome: BenchmarkOutcome,
      testBenchmarkComparisonMethod: BenchmarkComparisonMethod,
      expectedSymbol: string,
      expectedComparisonString: string
    ) => {
      const mockPoint = {
        ...mockThematicMapPointRAG,
        benchmarkComparisonOutcome: testBenchmarkOutcome,
      };

      const testPolarity: IndicatorPolarity = IndicatorPolarity.Unknown;

      const actual = generateThematicMapTooltipString(
        mockPoint,
        undefined,
        undefined,
        testBenchmarkComparisonMethod,
        testPolarity,
        mockUnits
      );

      console.log(actual);

      const expectedColour =
        getBenchmarkColour(
          testBenchmarkComparisonMethod,
          mockPoint.benchmarkComparisonOutcome,
          testPolarity
        ) ?? '';

      expect(actual).toEqual(expect.stringContaining(mockPoint.areaName));
      expect(actual).toEqual(
        expect.stringContaining(mockPoint.year.toString())
      );
      expect(actual).toEqual(expect.stringContaining(expectedColour));
      expect(actual).toEqual(expect.stringContaining(expectedSymbol));
      expect(actual).toEqual(
        expect.stringContaining(
          [mockPoint.value.toString(), mockUnits].join(' ')
        )
      );
      expect(actual).toEqual(
        expect.stringContaining(
          [testBenchmarkOutcome, expectedComparisonString].join(' ')
        )
      );
      expect(actual).toEqual(
        expect.stringContaining(
          getConfidenceLimitNumber(testBenchmarkComparisonMethod).toString()
        )
      );
    }
  );

  //   each([
  //     [BenchmarkOutcome.Lowest],
  //     [BenchmarkOutcome.Low],
  //     [BenchmarkOutcome.Middle],
  //     [BenchmarkOutcome.High],
  //     [BenchmarkOutcome.Highest],
  //     [BenchmarkOutcome.Best],
  //     [BenchmarkOutcome.Worst],
  // ]
  //   )
  it.todo(
    'should return the expected RAG tooltip for an area when outcome is similar'
  );
});
