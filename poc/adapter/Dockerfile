FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y nuget mono-devel mono-xbuild
RUN nuget update -self

WORKDIR /app

COPY dot_net_sdk .

RUN xbuild /p:Configuration=Release DotNetAdapterSDK.csproj


RUN xbuild Sample/AdapterLab.csproj

RUN cp bin/Release/DotNetAdapterSDK.dll DotNetAdapterSDK.dll
RUN cp Sample/obj/x86/Debug/AdapterLab.exe AdapterLab.exe
# RUN cp lib/NAudio/NAudio.dll NAudio.dll
# RUN cp lib/NAudio/NAudio.WindowsMediaFormat.dll NAudio.WindowsMediaFormat.dll

CMD ["mono", "AdapterLab.exe"]
