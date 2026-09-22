#!/bin/sh
set -eu

# Render provides its managed PostgreSQL connection URL as postgresql://... .
# Spring Boot expects the JDBC form, so convert it only at container startup.
if [ -n "${DATABASE_URL:-}" ] && [ -z "${JDBC_DATABASE_URL:-}" ]; then
  # Render connection strings include credentials as
  # postgresql://user:password@host:port/database. PostgreSQL JDBC expects
  # credentials separately, rather than in the JDBC URL's authority section.
  db_connection="${DATABASE_URL#postgresql://}"
  db_credentials="${db_connection%@*}"
  db_host_and_name="${db_connection#*@}"

  export JDBC_DATABASE_URL="jdbc:postgresql://${db_host_and_name}"
  export DB_USERNAME="${db_credentials%%:*}"
  export DB_PASSWORD="${db_credentials#*:}"
fi

exec java -jar /app/app.jar
