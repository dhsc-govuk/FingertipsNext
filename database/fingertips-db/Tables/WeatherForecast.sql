CREATE TABLE [dbo].[WeatherForecast]
(
  [Id] INT NOT NULL,
  [Date] DATE NOT NULL,
  [TemperatureC] INT NOT NULL,
  [Summary] NVARCHAR (255) NOT NULL,
  PRIMARY KEY CLUSTERED ([Id] ASC)
);
