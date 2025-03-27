import { render, screen } from '@testing-library/react';
import {
  FilterSummaryPanel,
  FilterSummaryPanelProps,
} from '@/components/molecules/FilterSummaryPanel/index';
import {SearchParams} from "@/lib/searchStateManager";
import {generateIndicatorDocument} from "@/lib/search/mockDataHelper";
import {mockAreaDataForNHSRegion} from "@/mock/data/areaData";
import {ALL_AREAS_SELECTED} from "@/lib/areaFilterHelpers/constants";
import {nhsPrimaryCareNetworksAreaType} from "@/lib/areaFilterHelpers/areaType";
import {userEvent, UserEvent} from "@testing-library/user-event";

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();

jest.mock('next/navigation', () => {
    const originalModule = jest.requireActual('next/navigation');

    return {
        ...originalModule,
        usePathname: () => mockPath,
        useSearchParams: () => {},
        useRouter: jest.fn().mockImplementation(() => ({
            replace: mockReplace,
        })),
    };
});

describe('FilterSummaryPanel', () => {
    let user: UserEvent;
    const mockChangeSelection = jest.fn();

    beforeEach(() => {
        user = userEvent.setup();
    });
    afterEach(() => {
        jest.clearAllMocks();
    })

    const defaultProps: FilterSummaryPanelProps = {
        selectedAreasData: [
            mockAreaDataForNHSRegion['E40000007'],
            mockAreaDataForNHSRegion['E40000012'],
        ],
        selectedIndicatorsData: [
            generateIndicatorDocument('1'),
            generateIndicatorDocument('2'),
        ],
        searchState: {
            [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
            [SearchParams.AreaTypeSelected]: nhsPrimaryCareNetworksAreaType.key,
        },
        changeSelection: mockChangeSelection
    }

    function renderPanel(props: FilterSummaryPanelProps = defaultProps) {
        render(<FilterSummaryPanel {...props} />);
    }

    it('should render selected indicator panel and selected area panel when data provided', () => {
        renderPanel();

        expect(screen.queryByTestId('selected-indicators-panel')).toBeInTheDocument();
        expect(screen.queryByTestId('selected-areas-panel')).toBeInTheDocument();
    });

    it('should render selected indicator panel but not selected area panel when no indicator data provided 1', () => {
        renderPanel({...defaultProps, selectedIndicatorsData: []});

        expect(screen.queryByTestId('selected-indicators-panel')).not.toBeInTheDocument();
        expect(screen.queryByTestId('selected-areas-panel')).toBeInTheDocument();
    });

    it('should render selected indicator panel but not selected area panel when no indicator data provided 2', () => {
        renderPanel({...defaultProps, selectedIndicatorsData: undefined});

        expect(screen.queryByTestId('selected-indicators-panel')).not.toBeInTheDocument();
        expect(screen.queryByTestId('selected-areas-panel')).toBeInTheDocument();
    });

    it('should render selected area panel but not selected indicator panel when no areas data provided 1', () => {
        renderPanel({...defaultProps, selectedAreasData: []});

        expect(screen.queryByTestId('selected-indicators-panel')).toBeInTheDocument();
        expect(screen.queryByTestId('selected-areas-panel')).not.toBeInTheDocument();
    });

    it('should render selected area panel but not selected indicator panel when no areas data provided 2', () => {
        renderPanel({...defaultProps, selectedAreasData: undefined});

        expect(screen.queryByTestId('selected-indicators-panel')).toBeInTheDocument();
        expect(screen.queryByTestId('selected-areas-panel')).not.toBeInTheDocument();
    });

    it('should render a change button', () => {
        renderPanel();

        expect(screen.queryByTestId('filter-summary-panel-change-selection')).toBeInTheDocument();
    });

    it('should call changeSelection prop when button is clicked', async () => {
        renderPanel();
        await user.click(screen.getByTestId('filter-summary-panel-change-selection'));

        expect(screen.queryByTestId('filter-summary-panel-change-selection')).toBeInTheDocument();
    });
});
