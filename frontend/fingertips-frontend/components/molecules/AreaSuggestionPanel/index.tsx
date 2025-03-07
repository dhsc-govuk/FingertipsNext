import { ListItem, UnorderedList, SearchIcon } from 'govuk-react';
import styled from 'styled-components';
import { AreaDocument } from '@/lib/search/searchTypes';
import { formatAreaName } from '@/lib/areaFilterHelpers/formatAreaName';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { usePathname, useRouter } from 'next/navigation';
import { HighlightText } from '@/components/atoms/HighlightText';

const StyleSearchSuggestionPanel = styled(UnorderedList)`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-left: 0px;
  margin-right: 0px;
`;

const AreaSuggestionPanelItem = styled(ListItem)`
  border-bottom: 1px solid #75738c;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  padding: 10px 1px;
  margin: 0;
  font-size: 19px;
  font-weight: 300;
`;

interface AreaAutoCompleteSuggestionPanelProps {
  suggestedAreas: AreaDocument[];
  searchHint: string;
  searchState?: SearchStateParams;
}

export const AreaAutoCompleteSuggestionPanel = ({
  suggestedAreas,
  searchHint,
  searchState,
}: AreaAutoCompleteSuggestionPanelProps) => {
  const stateManager = SearchStateManager.initialise(searchState);
  const pathname = usePathname();
  const router = useRouter();

  const updateUrlWithSelectedArea = (selectedAreaCode: string | undefined) => {
    if (!selectedAreaCode) {
      stateManager.removeAllParamFromState(SearchParams.AreasSelected);
    } else {
      stateManager.addParamValueToState(
        SearchParams.AreasSelected,
        selectedAreaCode
      );
    }
    router.replace(stateManager.generatePath(pathname), { scroll: false });
  };

  const selectedAreas = searchState?.[SearchParams.AreasSelected];

  if (
    (selectedAreas && selectedAreas?.length > 0) ||
    suggestedAreas.length === 0
  )
    return null;

  return (
    <StyleSearchSuggestionPanel data-testid="area-suggestion-panel">
      {suggestedAreas.map((area) => (
        <AreaSuggestionPanelItem
          key={`${area.areaCode}-${area.areaType}`}
          onClick={() => updateUrlWithSelectedArea(area.areaCode)}
        >
          <SearchIcon
            width="15px"
            height="15px"
            fill="#75738c"
            style={{ padding: '0px', margin: 'auto 10px auto auto' }}
          />
          <div style={{ flexGrow: 3, padding: '5px' }}>
            <HighlightText
              text={formatAreaName(area.areaCode, area.areaName, area.areaType)}
              searchHint={searchHint}
            />
          </div>
          <div
            style={{
              backgroundColor: '#E1E2E3',
              margin: 'auto',
              padding: '5px 8px 4px 8px',
              fontSize: '16px',
              textAlign: 'right',
              fontWeight: '300',
            }}
          >
            {area.areaType}
          </div>
        </AreaSuggestionPanelItem>
      ))}
    </StyleSearchSuggestionPanel>
  );
};
