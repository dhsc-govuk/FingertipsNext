import { updateIndicatorsSelectedUrlParam } from './clientActions';

const encodedUriSeperator = encodeURI(',');

describe('updateIndicatorsSelectedUrlParam', () => {
  it('should add the selected indicator to an empty initial param', () => {
    const originalParams = new URLSearchParams();

    const updatedParams = updateIndicatorsSelectedUrlParam(
      originalParams,
      '111',
      true
    );

    expect(updatedParams.get('indicatorsSelected')).toBe('111');
  });

  it('should add the selected indicator to an existing indicatorsSelected with 1 param', () => {
    const originalParams = new URLSearchParams();
    originalParams.set('indicatorsSelected', '111');

    const updatedParams = updateIndicatorsSelectedUrlParam(
      originalParams,
      '222',
      true
    );

    expect(updatedParams.get('indicatorsSelected')).toBe(
      `111${encodedUriSeperator}222`
    );
  });

  it('should remove the deselected indicator to an indicatorsSelected param with 2 params', () => {
    const originalParams = new URLSearchParams();
    originalParams.set('indicatorsSelected', `111${encodedUriSeperator}222`);

    const updatedParams = updateIndicatorsSelectedUrlParam(
      originalParams,
      '111',
      false
    );

    expect(updatedParams.get('indicatorsSelected')).toBe(`222`);
  });

  it('should completley remove the indicatorsSelected param with 1 indicator and it is deselected', () => {
    const originalParams = new URLSearchParams();
    originalParams.set('indicatorsSelected', `111`);

    const updatedParams = updateIndicatorsSelectedUrlParam(
      originalParams,
      '111',
      false
    );

    expect(updatedParams.get('indicatorsSelected')).toBe(null);
  });
});
