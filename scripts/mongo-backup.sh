#!/bin/bash

# sh scripts/mongo-backup.sh <dump_file_name>

docker exec -i mongo \
  mongodump \
  -d fullstack --archive > $1.dump