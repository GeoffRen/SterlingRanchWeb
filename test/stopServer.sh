#!/usr/bin/env bash

kill -SIGINT $(cat test/test.pid)
rm test/test.pid