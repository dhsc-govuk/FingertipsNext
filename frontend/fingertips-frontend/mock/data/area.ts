export const mockAreaData = (id: string) => ({
  id,
  name: `Greater Manchester ICB - ${id} sub-location`,
  groupType: `GT-${id}`,
  group: 'QOP',
});

export const mockAvailableGroupTypes = [
  {
    id: 'GT-001',
    name: 'Integrated Care Board',
  },
  {
    id: 'GT-002',
    name: 'Integrated Care Panel',
  },
  {
    id: 'GT-003',
    name: 'Integrated Care Shelf',
  },
];

export const mockAvailableGroup = [
  {
    id: 'QOP',
    name: 'Greater Manchester  ICB - QOP',
  },
  {
    id: 'LOP',
    name: 'Leeds  ICB - LOP',
  },
  {
    id: 'SOP',
    name: 'Sheffield  ICB - SOP',
  },
];

export const mockAvailableAreasInGroup = [
  {
    id: '001',
    name: 'Greater Manchester ICN - 001',
  },
  {
    id: '002',
    name: 'Greater Manchester ICN - 002',
  },
  {
    id: '003',
    name: 'Greater Manchester ICN - 003',
  },
  {
    id: '004',
    name: 'Greater Manchester ICN - 004',
  },
  {
    id: '005',
    name: 'Greater Manchester ICN - 005',
  },
  {
    id: '006',
    name: 'Greater Manchester ICN - 006',
  },
  {
    id: '007',
    name: 'Greater Manchester ICN - 007',
  },
  {
    id: '008',
    name: 'Greater Manchester ICN - 008',
  },
  {
    id: '009',
    name: 'Greater Manchester ICN - 008',
  },
  {
    id: '010',
    name: 'Greater Manchester ICN - 010',
  },
];
