#!/bin/bash

NAME=$1
ROUTER_NAME="router.js"
FNAME="$1.js"

cd "../services";

function checkIfExists () {
  if [ -e "$NAME" ]
  then
    echo "200"; # It exists
  else
    echo "400"; # It does not exist
  fi
}

FILE_EXISTS=$(checkIfExists);

if [[ "200" == "$FILE_EXISTS" ]]; then
  echo "Destroying directory";
  rm -rf $NAME;
else
  echo "File does not exist!";
  exit 1
fi

exit 0


