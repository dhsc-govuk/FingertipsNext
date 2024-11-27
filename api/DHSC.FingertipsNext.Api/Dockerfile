FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR "/src/DHSC.FingertipsNext.Api"
COPY ["DHSC.FingertipsNext.Api.csproj", "."]
RUN dotnet restore "DHSC.FingertipsNext.Api.csproj"
COPY . .
RUN dotnet build "DHSC.FingertipsNext.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "DHSC.FingertipsNext.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DHSC.FingertipsNext.Api.dll"]
