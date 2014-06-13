#!/bin/bash
set -e

echo '--- building app'
tishadow spec

echo '--- running unit tests'
jasmine-node app/spec
