#!/bin/bash

# Database port, defaults to mssql's default port.
DB_PORT=${DB_PORT:-1433}
SA_USERNAME=${SA_USERNAME:-sa}

sqlpackage \
    /Action:publish \
    /SourceFile:fingertips-db.dacpac \
    /TargetServerName:$DB_SERVER,$DB_PORT \
    /TargetDatabaseName:$DB_NAME \
    /TargetUser:$SA_USERNAME \
    /TargetPassword:$SA_PASSWORD \
    /TargetTrustServerCertificate:True # TODO: Need to deal with self-signed certificate
