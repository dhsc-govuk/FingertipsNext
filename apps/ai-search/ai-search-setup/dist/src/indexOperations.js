import { AREA_SEARCH_SUGGESTER_NAME, AreaSearchIndexColumnNames, INDICATOR_SEARCH_SCORING_PROFILE, IndicatorSearchIndexColumnNames, } from './constants.js';
export async function createIndex(indexClient, index) {
    try {
        console.log('Trying to delete an existing index');
        await indexClient.deleteIndex(index);
    }
    catch { }
    await indexClient.createOrUpdateIndex(index);
    console.log(`Created or modified index with name: ${index.name}`);
}
export async function populateIndex(searchClient, indexData) {
    await searchClient.mergeOrUploadDocuments(indexData);
    console.log(`Uploaded data to index with name: ${searchClient.indexName}`);
}
export function buildIndicatorSearchIndex(name) {
    return {
        name,
        fields: [
            {
                key: true,
                name: IndicatorSearchIndexColumnNames.INDICATOR_ID,
                type: 'Edm.String',
                searchable: true,
                sortable: true,
                filterable: true,
            },
            {
                name: IndicatorSearchIndexColumnNames.INDICATOR_NAME,
                type: 'Edm.String',
                searchable: true,
                sortable: true,
                filterable: true,
            },
            {
                name: IndicatorSearchIndexColumnNames.INDICATOR_DEFINITION,
                type: 'Edm.String',
                searchable: true,
                sortable: true,
                filterable: true,
            },
            {
                name: IndicatorSearchIndexColumnNames.INDICATOR_EARLIEST_DATA_PERIOD,
                type: 'Edm.String',
                searchable: false,
                sortable: false,
                filterable: false,
            },
            {
                name: IndicatorSearchIndexColumnNames.INDICATOR_LATEST_DATA_PERIOD,
                type: 'Edm.String',
                searchable: false,
                sortable: false,
                filterable: false,
            },
            {
                name: IndicatorSearchIndexColumnNames.INDICATOR_DATA_SOURCE,
                type: 'Edm.String',
                searchable: false,
                sortable: true,
                filterable: true,
            },
            {
                name: IndicatorSearchIndexColumnNames.INDICATOR_LAST_UPDATED,
                type: 'Edm.DateTimeOffset',
                searchable: false,
                sortable: true,
                filterable: true,
            },
            {
                name: IndicatorSearchIndexColumnNames.INDICATOR_AREAS,
                type: 'Collection(Edm.String)',
                searchable: false,
                sortable: false,
                filterable: true,
            },
            {
                name: IndicatorSearchIndexColumnNames.INDICATOR_AREAS_WITH_TRENDS,
                type: 'Collection(Edm.ComplexType)',
                fields: [
                    {
                        name: IndicatorSearchIndexColumnNames.INDICATOR_AREAS_WITH_TRENDS_TREND,
                        type: 'Edm.String',
                        searchable: false,
                        sortable: false,
                        filterable: false,
                    },
                    {
                        name: IndicatorSearchIndexColumnNames.INDICATOR_AREAS_WITH_TRENDS_AREA_CODE,
                        type: 'Edm.String',
                        searchable: false,
                        sortable: false,
                        filterable: false,
                    },
                ],
            },
            {
                name: IndicatorSearchIndexColumnNames.INDICATOR_HAS_INEQUALITIES,
                type: 'Edm.Boolean',
                searchable: false,
                sortable: false,
                filterable: false,
            },
            {
                name: IndicatorSearchIndexColumnNames.INDICATOR_UNIT_LABEL,
                type: 'Edm.String',
                searchable: false,
                sortable: false,
                filterable: false,
            },
        ],
        scoringProfiles: [
            {
                name: INDICATOR_SEARCH_SCORING_PROFILE,
                textWeights: {
                    weights: {
                        indicatorID: 20,
                        indicatorName: 10,
                        indicatorDefinition: 5,
                    },
                },
            },
        ],
        defaultScoringProfile: INDICATOR_SEARCH_SCORING_PROFILE,
    };
}
export function buildGeographySearchIndex(name) {
    return {
        name,
        fields: [
            {
                key: true,
                name: AreaSearchIndexColumnNames.AREA_KEY,
                type: 'Edm.String',
                searchable: false,
                sortable: false,
                filterable: false,
            },
            {
                name: AreaSearchIndexColumnNames.AREA_CODE,
                type: 'Edm.String',
                searchable: true,
                sortable: true,
                filterable: true,
            },
            {
                name: AreaSearchIndexColumnNames.AREA_TYPE,
                type: 'Edm.String',
                searchable: true,
                sortable: true,
                filterable: true,
            },
            {
                name: AreaSearchIndexColumnNames.AREA_NAME,
                type: 'Edm.String',
                searchable: true,
                sortable: true,
                filterable: true,
            },
        ],
        suggesters: [
            {
                name: AREA_SEARCH_SUGGESTER_NAME,
                searchMode: 'analyzingInfixMatching',
                sourceFields: [
                    AreaSearchIndexColumnNames.AREA_NAME,
                    AreaSearchIndexColumnNames.AREA_CODE,
                ],
            },
        ],
    };
}
