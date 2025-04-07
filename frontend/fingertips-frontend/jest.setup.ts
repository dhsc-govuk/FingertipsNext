import '@testing-library/jest-dom';
import 'jest-styled-components';

process.env.FINGERTIPS_API_URL = 'ft-api-url/';

const windowMock = {
  scrollTo: jest.fn(),
};

Object.assign(global, windowMock);
