/* eslint-disable import/no-anonymous-default-export */
import http from 'k6/http';
import { sleep, check } from 'k6';

const url =
  'http://localhost:3000/results?si=hospital&ats=england&gts=england&gs=E92000001';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<500', 'p(100)<5000'], // 95% of requests should be below 500ms and 100% below 5s
  },
};

export default function () {
  const res = http.get(url);
  check(res, { 'status is 200': (res) => res.status === 200 });
  sleep(1);
}
