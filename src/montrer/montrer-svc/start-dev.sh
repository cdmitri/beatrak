#!/bin/bash

export SERVICE_NAME=montrer-devshell-ss-hlsvc
export LOG_LEVEL=debug

cd /root/beatrak/src/montrer/montrer-svc/app
yarn express-dev
# yarn express-dev-stop
cd react-ui
yarn react-dev
# yarn react-dev-stop
