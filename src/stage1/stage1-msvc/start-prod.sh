#!/bin/bash
cd /root/beatrak/src/stage1/stage1-msvc/app
echo "// we need to sleep before init()"
echo "// for the sidecar to boot up"
echo "sleeping for 10sec before launching..."
sleep 10
LOG_LEVEL=debug node stage1.js
