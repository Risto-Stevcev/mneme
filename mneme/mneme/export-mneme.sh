#!/usr/bin/bash

HOST=$(cat credentials.txt | grep -Po '(?<=@).*(?=/)')
USERNAME=$(cat credentials.txt | grep -Po '(?<=MONGODB_USERNAME\=).*')
PASSWORD=$(cat credentials.txt | grep -Po '(?<=MONGODB_PASSWORD\=).*')
DB=$(cat credentials.txt | grep -Po '(?<=MONGODB_DB\=).*')
COLLECTION=$(cat credentials.txt | grep -Po '(?<=com:).*' | grep -Po '(?<=/).*')

mongoexport --host $HOST -u $USERNAME -p$PASSWORD --db $DB --collection $COLLECTION --out $1
