#!/bin/bash
cd /root/beatrak/src/beacon/beacon-msvc/app
echo "// we need to sleep before init()"
echo "// for the sidecar to boot up"
echo "sleeping for 10sec before launching..."
sleep 10
LOG_LEVEL=debug LOCPICK_HTTP_HOST=locpick-dep-istio.default.svc.cluster.local LOCPICK_HTTP_PORT=50001 LOCPICK_GRPC_PORT=51001 LOCPICK_GRPC_TLS_PORT=52001 node beacon.js
