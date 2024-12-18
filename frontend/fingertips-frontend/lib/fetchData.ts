import { connection } from 'next/server';

export async function fetchData(): Promise<any> {
  // We don't want to render this page statically
  await connection();

  const apiUrl = process.env.FINGERTIPS_API_URL;

  const response = await fetch(`${apiUrl}/weatherforecast`, {
    // Cache the data for 60s
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  console.log(typeof response.json);
  return await response.json();
}

export async function fetchData2(): Promise<any> {
  // We don't want to render this page statically
  await connection();

  const mockWeatherForecasts = [
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

  return mockWeatherForecasts;
}
