#!/bin/bash

# Database port, defaults to mssql's default port.
DB_PORT=${DB_PORT:-1433}
SA_USERNAME=${SA_USERNAME:-sa}
TRUST_CERT=${TRUST_CERT:-"False"}

if [[ $TRUST_CERT == "True" ]]; then
    echo "WARNING: Server certificate validation has been disabled (by setting the TRUST_CERT environment variable). This should only be done for local development!"
fi

# Wait a little time for the db to be ready to accept connections
sleep 7

sqlpackage \
    /Action:publish \
    /SourceFile:fingertips-db.dacpac \
    /TargetServerName:$DB_SERVER,$DB_PORT \
    /TargetDatabaseName:$DB_NAME \
    /TargetUser:$SA_USERNAME \
    /TargetPassword:$SA_PASSWORD \
    /TargetTrustServerCertificate:${TRUST_CERT}
