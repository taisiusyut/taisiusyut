#!/bin/bash

docker exec -i mongo mongo fullstack --eval "db.dropDatabase();"
