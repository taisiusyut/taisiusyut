#!/bin/bash

# sh scripts/mongo-import.sh <file path> <collection name>

docker exec -i mongo
docker cp $1 mongo:/tmp/$1
docker exec -i mongo mongoimport -h localhost:27017 -d fullstack -c $2 --file /tmp/$1

