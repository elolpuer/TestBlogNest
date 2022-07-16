#!/bin/bash
psql -U postgres <<-EOSQL
    CREATE USER egorg WITH PASSWORD 'password';
    CREATE DATABASE blog_nest;
    GRANT ALL PRIVILEGES ON DATABASE blog_nest TO egorg;
EOSQL