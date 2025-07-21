import { MockedFunction, vi } from 'vitest';
import { useApiAvailableAreas } from '@/components/charts/hooks/useApiAvailableAreas';
import { Area } from '@/generated-sources/ft-api-client';

vi.mock('@/components/charts/hooks/useApiAvailableAreas');
export const mockUseApiAvailableAreas = useApiAvailableAreas as MockedFunction<
  typeof useApiAvailableAreas
>;

mockUseApiAvailableAreas.mockReturnValue({
  availableAreas: [],
  availableAreasLoading: false,
  availableAreasError: null,
});

export const mockUseApiAvailableAreasSetup = (
  availableAreas: Area[] = [],
  availableAreasLoading = false,
  availableAreasError = null
) => {
  mockUseApiAvailableAreas.mockReturnValue({
    availableAreas,
    availableAreasLoading,
    availableAreasError,
  });
};
