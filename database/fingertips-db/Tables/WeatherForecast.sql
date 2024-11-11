CREATE TABLE [dbo].[WeatherForecast]
(
  [Id] INT IDENTITY NOT NULL,
  [Date] DATE NOT NULL,
  [TemperatureC] INT NOT NULL,
  [Summary] NVARCHAR (255) NOT NULL,
  PRIMARY KEY CLUSTERED ([Id] ASC)
);
