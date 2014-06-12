#!/bin/bash
set -e

echo '--- building app'
tishadow run

echo '--- running unit tests'
jasmine-node app/spec
