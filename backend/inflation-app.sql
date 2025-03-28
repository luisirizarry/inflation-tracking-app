\echo 'Delete and recreate inflation_app db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS inflation_app;
CREATE DATABASE inflation_app;
\connect inflation_app

\i inflation-app-schema.sql
\i inflation-app-seed.sql

\echo 'Delete and recreate inflation_app_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS inflation_app_test;
CREATE DATABASE inflation_app_test;
\connect inflation_app_test

\i inflation-app-schema.sql
