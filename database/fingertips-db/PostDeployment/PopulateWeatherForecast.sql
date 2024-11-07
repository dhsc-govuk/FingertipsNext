-- This file contains SQL statements that will be executed after the build script.

INSERT INTO WeatherForecast
  ([Date], [Summary], [TemperatureC])
VALUES
  ('2024-11-01', 'Freezing', -30),
  ('2024-11-01', 'Bracing', 0),
  ('2024-11-01', 'Chilly', 5),
  ('2024-11-01', 'Cool', 10),
  ('2024-11-01', 'Mild', 15),
  ('2024-11-01', 'Warm', 20),
  ('2024-11-01', 'Balmy', 25),
  ('2024-11-01', 'Hot', 30),
  ('2024-11-01', 'Sweltering', 40),
  ('2024-11-01', 'Scorching', 55);