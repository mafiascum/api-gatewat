#!/bin/bash

db_wait() {
    retry_count=0
    retryMax=10
    retrySleep=3
    until [[ $retry_count -ge $retryMax ]]; do
        set +e
        nc -z ${DB_HOST} ${DB_PORT}
        success=$?
	set -e
        [[ $success == 0 ]] && break
	((retry_count  ++)) || true
        echo "$(date) - waiting for database on ${DB_HOST}:${DB_PORT} to start before applying migrations"
        sleep $retrySleep
    done

    if [[ $success != 0 ]]; then
	echo "failed to connect to database after $retryMax tries." >&2
        exit 1
    fi
}

db_migrate() {
    echo "$(date) - applying migrations"
    sequelize db:migrate
}

db_wait && db_migrate && nodemon
