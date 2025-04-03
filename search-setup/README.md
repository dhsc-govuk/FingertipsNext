# fingertips-search-setup

The Fingertips search setup console app automates the creation and loading of data to a specified index within an existing Azure AI Search instance.

## Prerequisites

To run the application, ensure you have the following:

1. The correct version of Node.js installed. See [frontend/fingertips-frontend/README.md](../frontend/fingertips-frontend/README.md)
2. An already-existing Azure AI Search instance running. See [terraform/environment](../terraform/environment/) to create one, if not.

## Running the app

1. **Install dependencies**

```bash
npm install
```

2. **Create .env file**
   
Create a .env file from the existing .env.example template and populate it with values obtained from Azure.
If running the app to test code changes please set the **index name overrides** in the `.env` file so that
your changes will not affect anyone else.

3. **Run the app**
Note: when run in the pipeline, the indicators.json file is provided by the previous workflow job after being
processed by the trend-analysis app. This means it has the latest data and trends.

When running this locally, the search-service uses this file `./assets/indicators.json`. This will be up to date but
without trend data. If you want to load your target index with trend data you will also need to run the trend-analysis app locally
and then copy the contents of `../trend-analysis/TrendAnalysisApp/SearchData/assets/` to `./assets/indicators.json`.

```bash
npm run create-index
```

## Testing

This project uses Jest for testing.

### Running the Integration tests

```bash
npm run test
```

### Postman Collection

A postman collection has been added to the assets directory including some AI-Search queries. At present this only includes geographic search suggestions but can be expanded to include others as helpful. This collection can be imported into Postman and used. Note: it will be necessary to configure the Postman environment to hold the API-KEY AI_SEARCH_API_KEY from Azure AI-Search.
