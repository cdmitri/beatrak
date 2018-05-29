#!/bin/bash
cd /root/beatrak/src/beacon/beacon-msvc/app
LOG_LEVEL=debug LOCPICK_HTTP_HOST=locpick-dep-istio.default.svc.cluster.local LOCPICK_HTTP_PORT=50001 LOCPICK_GRPC_PORT=51001 LOCPICK_GRPC_TLS_PORT=52001 nodemon beacon.js
