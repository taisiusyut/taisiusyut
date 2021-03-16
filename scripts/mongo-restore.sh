#!/bin/bash

# sh scripts/mongo-restore.sh <dump_file_name>

docker exec -i mongo sh -c 'mongorestore -d taisiusyut --archive' < $1.dump

# docker exec -i mongo sh -c 'mongorestore --nsFrom "DB_NAME.*" --nsTo "taisiusyut.*" --archive' < $1.dump
