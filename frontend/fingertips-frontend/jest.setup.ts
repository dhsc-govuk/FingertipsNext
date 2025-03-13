import '@testing-library/jest-dom';
import 'jest-styled-components';

process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE = 'true';
process.env.FINGERTIPS_API_URL = 'ft-api-url/';

jest.spyOn(console, 'debug').mockImplementation(() => {});
