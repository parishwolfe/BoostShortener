#!/bin/bash

# This script resets the database for the BoostShortener application.

docker-compose down
docker volume rm boostshortener_db_data
docker compose up --build
