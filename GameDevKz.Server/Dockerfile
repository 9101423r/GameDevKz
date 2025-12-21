FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src


ENV NUGET_FALLBACK_PACKAGES=""


RUN mkdir -p /root/.nuget/NuGet \
    && printf "<configuration>\n  <packageSources>\n    <add key=\"nuget\" value=\"https://api.nuget.org/v3/index.json\" />\n  </packageSources>\n</configuration>" \
    > /root/.nuget/NuGet/NuGet.Config

COPY *.sln ./
COPY GameDevKz.Server/*.csproj ./GameDevKz.Server/

RUN dotnet restore --force

COPY . .
WORKDIR /src/GameDevKz.Server

RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "GameDevKz.Server.dll"]