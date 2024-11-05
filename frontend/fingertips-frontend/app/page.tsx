import Image from "next/image";
import { connection } from "next/server";

type Forecast = {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
};

export default async function Home() {
  // We don't want to render this page statically
  await connection();

  const apiUrl = process.env.FINGERTIPS_API_URL;

  if (!apiUrl) {
    throw new Error(
      "No API URL set. Have you set the FINGERTIPS_API_URL environment variable?"
    );
  }

  const weatherData = await fetch(apiUrl, {
    // Cache the data for 60s
    next: { revalidate: 60 },
  });
  const forecasts: Forecast[] = await weatherData.json();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="p-8">
          <Image
            className="float-right"
            src="/fingertips-logo.svg"
            alt="Fingertips logo"
            width={240}
            height={140}
            priority
          />

          <h1>FingertipsNext</h1>

          <p>
            Fingertips is a large public health data collection. Data is
            organised into themed profiles.
          </p>

          <ul>
            {forecasts.map((f) => (
              <li key={f.date}>
                {f.date}, {f.temperatureC}, {f.temperatureF}, {f.summary}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
