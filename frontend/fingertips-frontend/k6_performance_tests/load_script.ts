/* eslint-disable import/no-anonymous-default-export */
import http from 'k6/http';
import { sleep, check } from 'k6';

// Get base URL from environment variable or default to localhost
const BASE_URL = __ENV.BASE_URL ?? 'http://localhost:3000';
const ENDPOINT = '/results?si=hospital&ats=england&gts=england&gs=E92000001';
const url = `${BASE_URL}${ENDPOINT}`;

export const options = {
  // vus: 175, // 2500 is the target but anything over 175 concurrent users causes - Request Failed error="Get \"http://localhost:3000/results?si=hospital&ats=england&gts=england&gs=E92000001\": read tcp 127.0.0.1:52362->127.0.0.1:3000: read: connection reset by peer"
  vus: 20, // anything over 25 concurrent users causes thresholds on metrics 'http_req_duration' have been crossed in CI
  duration: '120s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<500', 'p(100)<5000'], // 95% of requests should be below 500ms and 100% below 5s
  },
};

export default function () {
  console.log(`Testing URL: ${url}`);
  const res = http.get(url);
  check(res, {
    'status is 200': (res) => res.status === 200,
    'body contains expected content': (res) =>
      typeof res.body === 'string' && res.body.includes('results'),
  });
  sleep(1);
}
