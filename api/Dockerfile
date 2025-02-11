# Test comment 1
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR "/src/api"
COPY ["/", "."]
RUN dotnet restore "DHSC.FingertipsNext.Api.sln"
COPY . .
RUN dotnet build "DHSC.FingertipsNext.Api.sln" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR "/src/api"
RUN dotnet publish "DHSC.FingertipsNext.Api.sln" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
USER root
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY --from=publish /app/publish .
USER $APP_UID
ENTRYPOINT ["dotnet", "DHSC.FingertipsNext.Api.dll"]
