import { WeatherForecast } from '@/generated-sources/api-client';

export const mockWeatherForecasts: WeatherForecast[] = [
  {
    date: new Date('2024-12-01'),
    temperatureC: -30,
    temperatureF: -21,
    summary: 'Freezing',
  },
  {
    date: new Date('2024-12-02'),
    temperatureC: 0,
    temperatureF: 32,
    summary: 'Bracing',
  },
  {
    date: new Date('2024-12-03'),
    temperatureC: 5,
    temperatureF: 40,
    summary: 'Chilly',
  },
  {
    date: new Date('2024-12-04'),
    temperatureC: 10,
    temperatureF: 49,
    summary: 'Cool',
  },
  {
    date: new Date('2024-12-05'),
    temperatureC: 15,
    temperatureF: 58,
    summary: 'Mild',
  },
  {
    date: new Date('2024-12-06'),
    temperatureC: 20,
    temperatureF: 67,
    summary: 'Warm',
  },
  {
    date: new Date('2024-12-07'),
    temperatureC: 25,
    temperatureF: 76,
    summary: 'Balmy',
  },
  {
    date: new Date('2024-12-08'),
    temperatureC: 30,
    temperatureF: 85,
    summary: 'Hot',
  },
  {
    date: new Date('2024-12-09'),
    temperatureC: 40,
    temperatureF: 103,
    summary: 'Sweltering',
  },
  {
    date: new Date('2024-12-10'),
    temperatureC: 55,
    temperatureF: 130,
    summary: 'Scorching',
  },
];
