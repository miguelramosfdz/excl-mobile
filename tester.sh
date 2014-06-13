#!/bin/bash
set -e

echo '--- building app'
tishadow test

echo '--- running unit tests'
jasmine-node app/spec
