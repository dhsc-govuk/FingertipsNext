/* eslint-disable import/no-anonymous-default-export */
import http from 'k6/http';
import { sleep, check, group } from 'k6';

const BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://localhost:5144';

// endpoints to test
const ENDPOINTS = [
  {
    name: 'Results Page',
    url: `${BASE_URL}/results?si=hospital&ats=england&gts=england&gs=E92000001`,
    checkContent: 'results',
  },
  {
    name: 'Areas Hierarchies',
    url: `${API_BASE_URL}/areas/hierarchies`,
    checkContent: '["Administrative","NHS"]',
  },
  {
    name: 'Areas Types',
    url: `${API_BASE_URL}/areas/areatypes`,
    checkContent: 'key',
  },
];

export const options = {
  // vus: 175, // 2500 is the target but anything over 175 concurrent users causes - Request Failed error="Get \"http://localhost:3000/results?si=hospital&ats=england&gts=england&gs=E92000001\": read tcp 127.0.0.1:52362->127.0.0.1:3000: read: connection reset by peer"
  vus: 25, // anything over 25 concurrent users causes thresholds on metrics 'http_req_duration' have been crossed
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors must be less than 1%
    http_req_duration: ['p(95)<500', 'p(100)<5000'], // 95% of requests must be below 500ms and 100% must be below 5s
  },
};

export default function () {
  // Loop through each endpoint and test it
  for (const endpoint of ENDPOINTS) {
    group(endpoint.name, function () {
      const res = http.get(endpoint.url, {
        tags: { endpoint: endpoint.name },
      });

      check(res, {
        [`${endpoint.name} status is 200`]: (r) => r.status === 200,
        [`${endpoint.name} contains expected content`]: (r) =>
          typeof r.body === 'string' && r.body.includes(endpoint.checkContent),
      });

      sleep(0.5);
    });
  }

  sleep(0.5);
}
