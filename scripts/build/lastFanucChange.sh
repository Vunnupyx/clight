echo $(git describe --tags $(git log -n 1 --pretty=format:%H -- docker/mdclight-base.Dockerfile docker/mdclight-fanuc.Dockerfile src/modules/Southbound/DataSources/Fanuc/ ))