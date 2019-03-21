#!/bin/bash

npm install
docker build -t gib-dummy-services .

# docker run -p 80:3050 gib-dummy-services