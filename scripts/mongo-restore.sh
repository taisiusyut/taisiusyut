#!/bin/bash

# sh scripts/mongo-restore.sh <dump_file_name>

docker exec -i mongo \
  mongorestore \
  -d fullstack --archive < $1.dump
