echo $(git describe --tags $(git log -n 1 --pretty=format:%H -- docker/mdclight-base.Dockerfile docker/mdclight-fanuc.Dockerfile docker/mdclight.Dockerfile src/modules/Southbound/DataSources/Fanuc/ package.json tsconfig.json src/ ))