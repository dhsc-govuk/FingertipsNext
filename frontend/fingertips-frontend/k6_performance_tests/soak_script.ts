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
  stages: [
    { duration: '5m', target: 20 }, // traffic ramp-up from 1 to 20 users over 5 minutes - anything over 20 causes threshold errors even at short duration
    { duration: '8h', target: 20 }, // stay at 20 users for 8 hours - anything over 20 causes threshold errors even at short duration
    { duration: '5m', target: 0 }, // ramp-down to 0 users
  ],
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
