#!/bin/bash
# Description: Log in the remote host to all necessary registries

# docker registries
DEV=datahubdev.azurecr.io
PROD=
STAGE=celosnextdev.azurecr.io

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
SSHHOST=$($SCRIPTPATH/../devTools/checkEnvironmentVariable.sh)
SSHCOMMAND="ssh $SSHHOST"

# prod
# read -p "Token for PROD registry: " TOKEN1
# DOCKERLOGINPRODCOMMAND="docker login -u codestryke-pk-pull -p $TOKEN1 $PROD"

# dev
read -p "Token for DEV registry: " TOKEN2
DOCKERLOGINDEVCOMMAND="docker login -u codestryke-pk-pull -p $TOKEN2 $DEV"

# stage
read -p "Token for STAGE registry: " TOKEN3
DOCKERLOGINSTAGECOMMAND="docker login -u codestryke-test -p $TOKEN3 $STAGE"


# chained commands
CHAINED="$DOCKERLOGINPRODCOMMAND && $DOCKERLOGINDEVCOMMAND && $DOCKERLOGINSTAGECOMMAND"

# Run commands
$SSHCOMMAND "$CHAINED"