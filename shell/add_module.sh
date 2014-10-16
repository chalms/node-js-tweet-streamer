#!/bin/bash

NAME=$1
ROUTER_NAME="router.js"
FNAME="$1.js"

cd "../services";

function checkIfExists () {
  if [ -e "$NAME" ]
  then
    echo "200";
  else
    echo "400";
  fi
}

FILE_EXISTS=$(checkIfExists);

if [[ "400" == "$FILE_EXISTS" ]]; then

  echo "Making Directory"

  mkdir $1;
  cd $1;

  touch $ROUTER_NAME;

  exit 0
else
  echo "File already exists!"
  exit 1
fi






