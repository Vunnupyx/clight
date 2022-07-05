#!/bin/bash
# Description: Log in the remote host to all necessary registries

# docker registries
DEV=mdclightdev.azurecr.io
PROD=mdclight.azurecr.io
STAGE=mdclightstaging.azurecr.io

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
SSHHOST=$($SCRIPTPATH/../devTools/checkEnvironmentVariable.sh)
SSHCOMMAND="ssh $SSHHOST"

# prod
read -p "Token for PROD registry: " TOKEN1
DOCKERLOGINPRODCOMMAND="docker login -u iot-connector-flex-pull -p $TOKEN1 $PROD"

# dev
read -p "Token for DEV registry: " TOKEN2
DOCKERLOGINDEVCOMMAND="docker login -u iot-connector-flex-pull -p $TOKEN2 $DEV"

# stage
read -p "Token for STAGE registry: " TOKEN3
DOCKERLOGINSTAGECOMMAND="docker login -u iot-connector-flex-pull -p $TOKEN3 $STAGE"


# chained commands
CHAINED="$DOCKERLOGINPRODCOMMAND && $DOCKERLOGINDEVCOMMAND && $DOCKERLOGINSTAGECOMMAND"

# Run commands
$SSHCOMMAND "$CHAINED"