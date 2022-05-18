#!/bin/bash
### USAGE: ./yesOrNo.sh <DO YOU WANT TO DO THIS?> <TODO-COMMAND>
echo "$1"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) $2; break;;
        No ) break;;
    esac
done