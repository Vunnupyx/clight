echo $(git describe --tags $(git log -n 1 --pretty=format:%H -- azure-pipelines-dev-mdclight.yml docker/mdclight-base.Dockerfile docker/mdclight-fanuc.Dockerfile Worker ))