#!/bin/sh
set -eu

# Render provides its managed PostgreSQL connection URL as postgresql://... .
# Spring Boot expects the JDBC form, so convert it only at container startup.
if [ -n "${DATABASE_URL:-}" ] && [ -z "${JDBC_DATABASE_URL:-}" ]; then
  export JDBC_DATABASE_URL="jdbc:${DATABASE_URL}"
fi

exec java -jar /app/app.jar
