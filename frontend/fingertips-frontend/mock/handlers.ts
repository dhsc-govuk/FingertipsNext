import { http, HttpResponse } from 'msw';
import user from './data/forecasts.json';

export const handlers = [
  http.get(`${process.env.FINGERTIPS_API_URL}`, () => HttpResponse.json(user)),
];
