import { ListItem, UnorderedList, SearchIcon } from 'govuk-react';
import styled from 'styled-components';
import { SuggestionResult } from '@/lib/search/searchTypes';
import { generateAreaDisplayString } from '@/lib/areaFilterHelpers/generateAreaDisplayString';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { usePathname, useRouter } from 'next/navigation';
import { HighlightText } from '@/components/atoms/HighlightText';
import { FOCUSABLE } from '@govuk-react/constants';
import { useLoadingState } from '@/context/LoaderContext';
import {
  allAreaTypes,
  englandAreaType,
} from '@/lib/areaFilterHelpers/areaType';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

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
  suggestedAreas: SuggestionResult[];
}

export const AreaAutoCompleteSuggestionPanel = ({
  suggestedAreas,
}: AreaAutoCompleteSuggestionPanelProps) => {
  const { setIsLoading } = useLoadingState();
  const searchState = useSearchStateParams();

  const stateManager = SearchStateManager.initialise(searchState);
  const pathname = usePathname();
  const router = useRouter();

  const updateUrlWithSelectedArea = (
    selectedAreaCode: string | undefined,
    areaTypeSelected: string
  ) => {
    setIsLoading(true);

    const selectedAreaTypeKey =
      allAreaTypes.find((areaType) => areaType.name === areaTypeSelected)
        ?.key ?? englandAreaType.key;

    if (!selectedAreaCode) {
      stateManager.removeAllParamFromState(SearchParams.AreasSelected);
    } else {
      stateManager.removeParamValueFromState(SearchParams.GroupTypeSelected);
      stateManager.removeParamValueFromState(SearchParams.GroupSelected);
      stateManager.addParamValueToState(
        SearchParams.AreasSelected,
        selectedAreaCode
      );
      stateManager.addParamValueToState(
        SearchParams.AreaTypeSelected,
        selectedAreaTypeKey
      );

      if (selectedAreaCode === areaCodeForEngland) {
        stateManager.addParamValueToState(
          SearchParams.GroupTypeSelected,
          englandAreaType.key
        );
        stateManager.addParamValueToState(
          SearchParams.GroupSelected,
          areaCodeForEngland
        );
        stateManager.addParamValueToState(
          SearchParams.GroupAreaSelected,
          ALL_AREAS_SELECTED
        );
      }
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
          key={`${area.document.areaCode}-${area.document.areaType}`}
        >
          <SuggestionButton
            data-testid={`area-suggestion-item-${area.document.areaCode}`}
            onClick={(e) => {
              e.preventDefault();
              updateUrlWithSelectedArea(
                area.document.areaCode,
                area.document.areaType
              );
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
                text={generateAreaDisplayString(
                  area.document.areaCode,
                  area.document.areaName,
                  area.document.areaType,
                  area.document.postcode
                )}
                searchHint={area.text}
              />
            </div>
            <AreaTypeTag>{area.document.areaType}</AreaTypeTag>
          </SuggestionButton>
        </AreaSuggestionPanelItem>
      ))}
    </StyleSearchSuggestionPanel>
  );
};
