FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dacpacbuild
WORKDIR /dacpac
COPY . .
RUN dotnet build "fingertips-db.sqlproj" -c Release -o build

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dacpacdeploy
WORKDIR /deploy-db
RUN dotnet tool install -g microsoft.sqlpackage
ENV PATH="$PATH:~/.dotnet/tools"
COPY --from=dacpacbuild /dacpac/build/*.dacpac .
COPY entrypoint.sh .

RUN chmod a+x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]