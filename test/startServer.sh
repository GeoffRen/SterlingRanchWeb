#!/usr/bin/env bash

# Start Node server
NODE_ENV=test PORT=8081 node src/server/index.js &
echo $! > test/test.pid