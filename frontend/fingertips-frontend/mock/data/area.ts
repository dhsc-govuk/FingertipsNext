export const mockAreaData = (id: string) => {
  const areaName = Number(id) > 100 ? 'Leeds' : 'Greater Manchester';
  const group = Number(id) > 100 ? 'QOP' : 'LOP';
  return {
    id,
    name: `${areaName} ICB - ${id} sub-location`,
    groupType: `GT-${id}`,
    group,
  };
};

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

export const mockAvailableAreasInGroupQOP = [
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
    name: 'Greater Manchester ICN - 009',
  },
  {
    id: '010',
    name: 'Greater Manchester ICN - 010',
  },
];

export const mockAvailableAreasInGroupLOP = [
  {
    id: '101',
    name: 'Leeds ICN - 101',
  },
  {
    id: '102',
    name: 'Leeds ICN - 102',
  },
  {
    id: '103',
    name: 'Leeds ICN - 103',
  },
  {
    id: '104',
    name: 'Leeds ICN - 104',
  },
  {
    id: '105',
    name: 'Leeds ICN - 105',
  },
  {
    id: '106',
    name: 'Leeds ICN - 106',
  },
  {
    id: '107',
    name: 'Leeds ICN - 107',
  },
  {
    id: '108',
    name: 'Leeds ICN - 108',
  },
  {
    id: '109',
    name: 'Leeds ICN - 109',
  },
  {
    id: '110',
    name: 'Leeds ICN - 110',
  },
];
