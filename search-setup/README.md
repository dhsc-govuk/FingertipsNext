# fingertips-search-setup

The Fingertips search setup console app automates the creation and loading of data to a specified index within an existing Azure AI Search instance.

## Prerequisites

To run the application, ensure you have the following:

1. The correct version of Node.js installed. See [frontend/fingertips-frontend/README.md](../frontend/fingertips-frontend/README.md)
2. An already-existing Azure AI Search instance running. See [terraform/environment](../terraform/environment/) to create one, if not.

## Running the app

1. **Install dependencies**

```
npm install
```

2. **Create .env file**
   Create a .env file from the existing .env.example template and populate it with values obtained from Azure.

3. **Run the app**

```
npm run create-index
```

## Testing

This project uses Jest for testing.

### Running the Integration tests

```bash
npm run test
```
