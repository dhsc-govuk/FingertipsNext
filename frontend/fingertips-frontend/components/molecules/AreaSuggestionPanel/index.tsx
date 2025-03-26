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
import { FOCUSABLE } from '@govuk-react/constants';
import { useLoader } from '@/context/LoaderContext';

const StyleSearchSuggestionPanel = styled(UnorderedList)`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-left: 0px;
  margin-right: 0px;
  list-style-type: none;
`;

const AreaTypeTag = styled('div')({
  backgroundColor: '#E1E2E3',
  margin: 'auto',
  padding: '5px 8px 4px 8px',
  fontSize: '16px',
  textAlign: 'right',
  fontWeight: '300',
});

const AreaSuggestionPanelItem = styled(ListItem)({
  borderBottom: '1px solid #75738c',
  padding: '10px 1px',
  margin: 0,
});

const SuggestionButton = styled('button')({
  ...FOCUSABLE,
  border: 0,
  background: 'white',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  fontSize: '19px',
  fontWeight: '300',
  width: '100%',
  padding: '1px 0px 1px 0px',
});

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
  const { setIsLoading } = useLoader();

  const updateUrlWithSelectedArea = (selectedAreaCode: string | undefined) => {
    setIsLoading(true);

    if (!selectedAreaCode) {
      stateManager.removeAllParamFromState(SearchParams.AreasSelected);
    } else {
      stateManager.removeParamValueFromState(SearchParams.AreaTypeSelected);
      stateManager.removeParamValueFromState(SearchParams.GroupTypeSelected);
      stateManager.removeParamValueFromState(SearchParams.GroupSelected);
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
        <AreaSuggestionPanelItem key={`${area.areaCode}-${area.areaType}`}>
          <SuggestionButton
            data-testid={`area-suggestion-item-${area.areaCode}`}
            onClick={(e) => {
              e.preventDefault();
              updateUrlWithSelectedArea(area.areaCode);
            }}
          >
            <SearchIcon
              width="15px"
              height="15px"
              fill="#75738c"
              style={{ padding: '0px', margin: 'auto 10px auto auto' }}
            />
            <div style={{ flexGrow: 3, padding: '5px', textAlign: 'left' }}>
              <HighlightText
                text={formatAreaName(
                  area.areaCode,
                  area.areaName,
                  area.areaType
                )}
                searchHint={searchHint}
              />
            </div>
            <AreaTypeTag>{area.areaType}</AreaTypeTag>
          </SuggestionButton>
        </AreaSuggestionPanelItem>
      ))}
    </StyleSearchSuggestionPanel>
  );
};
