#!/bin/bash


NAME=$1
ROUTER_NAME="router.js"
FNAME="$1.js"

cd "../services";

# echo "Variables Defined";

function checkIfExists () {
  if [ -e "$NAME" ]
  then
    echo "200"; # File does exist
  else
    echo "400";  # File does exist
  fi
}

# echo "About to check if exists";

FILE_EXISTS=$(checkIfExists);

# echo "Checked if exists!";

# echo $FILE_EXISTS;

# echo $FNAME;

# echo "About to run if statement!";

if [[ "400" == "$FILE_EXISTS" ]]; then
  # echo "Making dir";

  echo "Making Directory"

  mkdir $1;
  cd $1;

  echo "Adding Router.."

  touch $ROUTER_NAME;

  exit 0
else
  echo "File already exists!";
  exit 1
fi






