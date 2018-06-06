env:
ifndef HOSTNAME
	$(eval export HOSTNAME=$(shell hostname))
	@echo "HOSTNAME="${HOSTNAME}
endif

ifndef ROOT_SRC_DIR
	$(eval ROOT_SRC_DIR=$(abspath ${PWD}/../..))
	@echo "ROOT_SRC_DIR="${ROOT_SRC_DIR}
endif
	$(eval export NODE_PATH=/usr/lib/node_modules)
	@echo "NODE_PATH="${NODE_PATH}
ifndef TARGET
TARGET = devshell
endif

banner: 
	@echo "----------------------------------------"
	@echo "-"
	@echo "-"
	@echo "-"
	@echo "- TARGET = "${TARGET}
	@echo "-"
	@echo "- targets: devshell"
	@echo "-          prod"
	@echo "-          stage1-cla (prod)"
	@echo "-          stage1-clb (prod)"
	@echo "- ex.: $$ TARGET=prod make build"
	@echo "-      $$ TARGET=devshell make create"
	@echo "-      $$ TARGET=stage1-cla make delete"
	@echo "-"
	@echo "-"
	@echo "-"
	@echo "----------------------------------------"


#
# TOP
#
build: env banner k8s-build-$(TARGET)
create: env banner k8s-create-$(TARGET)
delete: env banner k8s-delete-$(TARGET)
shell: env banner k8s-shell-$(TARGET)
shell-envoy: banner k8s-shell-envoy-${TARGET}

#
# PROD
#
k8s-build-prod:
	mkdir -p ./stage1-msvc/common/
	mkdir -p ./stage1-msvc/protos/
	mkdir -p ./stage1-msvc/keys/
	cp -rf ../common/* ./stage1-msvc/common/
	cp -rf ../protos/* ./stage1-msvc/protos/
	cp -rf ../protos/* ./stage1-msvc/keys/
	$(MAKE) -C ./stage1-msvc k8s-build
	$(MAKE) -C ./stage1-envoy k8s-build

#
# DEVSHELL
#
k8s-build-devshell:
	$(MAKE) -C ./stage1-msvc k8s-build-devshell
	$(MAKE) -C ./stage1-envoy k8s-build

k8s-create-devshell: env 
k8s-create-devshell: NODE=${HOSTNAME}
k8s-create-devshell: REPLICAS=1
k8s-create-devshell: LOG_LEVEL=debug
k8s-create-devshell: SERVICE_NAME=stage1-devshell-ss-hlsvc
k8s-create-devshell: APP=${SERVICE_NAME}
k8s-create-devshell: ZONE=zdevshell
k8s-create-devshell: CLUSTER=cla
k8s-create-devshell: APP_VOLUME_PATH=${ROOT_SRC_DIR}/stage1/stage1-msvc/app
k8s-create-devshell: COMMON_VOLUME_PATH=${ROOT_SRC_DIR}/common
k8s-create-devshell: 
	${ROOT_SRC_DIR}/tools/templ.js --templ=${SERVICE_NAME}.templ.yaml --data='{ "service-name" : "$(SERVICE_NAME)", "app" : "${APP}", "zone" : "${ZONE}", "cluster" : "$(CLUSTER)", "log-level" : "$(LOG_LEVEL)", "replicas" : "${REPLICAS}", "hostname" : "${NODE}", "app-volume-path" : "${APP_VOLUME_PATH}", "common-volume-path" : "${COMMON_VOLUME_PATH}" }' --file=${SERVICE_NAME}.yaml
	kubectl create -f ./${SERVICE_NAME}.yaml

k8s-delete-devshell: SERVICE_NAME=stage1-devshell-ss-hlsvc
k8s-delete-devshell:
	kubectl delete -f ${SERVICE_NAME}.yaml

# run /start-dev.sh
# (trace/debug/info/warn/error
# this ENV will overwrite env that was set
# during pod create

k8s-shell-devshell: SERVICE_NAME=stage1-devshell-ss-hlsvc
k8s-shell-devshell: LOG_LEVEL=debug
k8s-shell-devshell: ZONE=zdevshell
k8s-shell-devshell: CLUSTER=clstage1-devshell
k8s-shell-devshell:
	kubectl exec ${SERVICE_NAME}-0 --container stage1 -i -t -- /bin/bash -l -c "LOG_LEVEL=$(LOG_LEVEL) CLUSTER=$(CLUSTER) ZONE=$(ZONE) exec -l /bin/bash"


#
# STAGE1-CLA
#
k8s-build-stage1-cla:
	mkdir -p ./stage1-msvc/common/
	cp -rf ../common/* ./stage1-msvc/common/
	$(MAKE) -C ./stage1-msvc k8s-build
	$(MAKE) -C ./stage1-envoy k8s-build


k8s-create-stage1-cla: env
k8s-create-stage1-cla: SERVICE_NAME=stage1-cla-ss-hlsvc
k8s-create-stage1-cla: APP=${SERVICE_NAME}
k8s-create-stage1-cla: REPLICAS=1
k8s-create-stage1-cla: LOG_LEVEL=error
k8s-create-stage1-cla: CLUSTER=cla
k8s-create-stage1-cla: ZONE=nozone
k8s-create-stage1-cla: 
	${ROOT_SRC_DIR}/tools/templ.js --templ=stage1-ss-hlsvc.templ.yaml --data='{ "service-name" : "$(SERVICE_NAME)", "cluster" : "$(CLUSTER)", "zone" : "$(ZONE)", "replicas" : "$(REPLICAS)", "log-level" : "$(LOG_LEVEL)", "app" : "${APP}", "hostname" : "$(HOSTNAME)"}' --file=${SERVICE_NAME}.yaml
	kubectl create -f ./${SERVICE_NAME}.yaml

k8s-delete-stage1-cla: SERVICE_NAME=stage1-cla-ss-hlsvc
k8s-delete-stage1-cla:
	kubectl delete -f ${SERVICE_NAME}.yaml

k8s-shell-stage1-cla: SERVICE_NAME=stage1-cla-ss-hlsvc
k8s-shell-stage1-cla: LOG_LEVEL=debug
k8s-shell-stage1-cla:
	kubectl exec ${SERVICE_NAME}-0 --container stage1 -i -t -- /bin/bash -l -c "LOG_LEVEL=$(LOG_LEVEL) exec -l /bin/bash"


#
# STAGE1-CLB
#
k8s-build-stage1-clb:
	mkdir -p ./stage1-msvc/common/
	cp -rf ../common/* ./stage1-msvc/common/
	$(MAKE) -C ./stage1-msvc k8s-build
	$(MAKE) -C ./stage1-envoy k8s-build

k8s-create-stage1-clb: env
k8s-create-stage1-clb: SERVICE_NAME=stage1-clb-ss-hlsvc
k8s-create-stage1-clb: APP=${SERVICE_NAME}
k8s-create-stage1-clb: REPLICAS=1
k8s-create-stage1-clb: LOG_LEVEL=error
k8s-create-stage1-clb: CLUSTER=clb
k8s-create-stage1-clb: ZONE=nozone
k8s-create-stage1-clb: 
	${ROOT_SRC_DIR}/tools/templ.js --templ=stage1-ss-hlsvc.templ.yaml --data='{ "service-name" : "$(SERVICE_NAME)", "cluster" : "$(CLUSTER)", "zone" : "$(ZONE)", "replicas" : "$(REPLICAS)", "log-level" : "$(LOG_LEVEL)", "app" : "${APP}", "hostname" : "$(HOSTNAME)"}' --file=${SERVICE_NAME}.yaml
	kubectl create -f ./${SERVICE_NAME}.yaml

k8s-delete-stage1-clb: SERVICE_NAME=stage1-clb-ss-hlsvc
k8s-delete-stage1-clb:
	kubectl delete -f ${SERVICE_NAME}.yaml

k8s-shell-stage1-clb: SERVICE_NAME=stage1-clb-ss-hlsvc
k8s-shell-stage1-clb: LOG_LEVEL=debug
k8s-shell-stage1-clb:
	kubectl exec ${SERVICE_NAME}-0 --container stage1 -i -t -- /bin/bash -l -c "LOG_LEVEL=$(LOG_LEVEL) exec -l /bin/bash"


##
## ISTIO
##
k8s-build-devshell-istio:
	mkdir -p ./stage1-msvc/common/
	cp -rf ../common/* ./stage1-msvc/common/
	mkdir -p ./stage1-msvc/protos/
	cp -rf ../protos/* ./stage1-msvc/protos/
	mkdir -p ./stage1-msvc/keys/
	cp -rf ../keys/* ./stage1-msvc/keys/
	$(MAKE) -C ./stage1-msvc k8s-build-devshell

k8s-create-devshell-istio: env 
k8s-create-devshell-istio: LOG_LEVEL=debug
k8s-create-devshell-istio: REPLICAS=1
k8s-create-devshell-istio: SERVICE_NAME=stage1-devshell-istio
k8s-create-devshell-istio: APP=${SERVICE_NAME}
k8s-create-devshell-istio: ZONE=zdevshell
k8s-create-devshell-istio: CLUSTER=cla
k8s-create-devshell-istio: BEATRAK_VOLUME_PATH=${ROOT_SRC_DIR}
k8s-create-devshell-istio: 
	${ROOT_SRC_DIR}/tools/templ.js --templ=${SERVICE_NAME}.templ.yaml --data='{ "service-name" : "$(SERVICE_NAME)", "app" : "${APP}", "zone" : "${ZONE}", "cluster" : "$(CLUSTER)", "log-level" : "$(LOG_LEVEL)", "replicas" : "${REPLICAS}", "hostname" : "${HOSTNAME}", "beatrak-volume-path" : "${BEATRAK_VOLUME_PATH}" }' --file=${SERVICE_NAME}.yaml
	kubectl create -f ./${SERVICE_NAME}.yaml

k8s-delete-devshell-istio: SERVICE_NAME=stage1-devshell-istio
k8s-delete-devshell-istio:
	kubectl delete -f ${SERVICE_NAME}.yaml

k8s-shell-devshell-istio: LOG_LEVEL=debug
k8s-shell-devshell-istio: SERVICE_NAME=stage1-devshell-istio
k8s-shell-devshell-istio:
	mkdir -p ./stage1-msvc/common/
	cp -rf ../common/* ./stage1-msvc/common/
	mkdir -p ./stage1-msvc/protos/
	cp -rf ../protos/* ./stage1-msvc/protos/
	mkdir -p ./stage1-msvc/keys/
	cp -rf ../keys/* ./stage1-msvc/keys/
	cd ./stage1-msvc/app; yarn
	kubectl exec -it $$(kubectl get pods -n default -o 'jsonpath={.items[?(@.metadata.labels.app=="stage1-devshell-istio")].metadata.name}') -c ${SERVICE_NAME} -- /bin/bash -l -c "LOG_LEVEL=$(LOG_LEVEL) exec -l /bin/bash"


##
## ISTIO STAGE1-PREM-1
##
k8s-build-stage1-istio-prem-1:
	mkdir -p ./stage1-msvc/common/
	cp -rf ../common/* ./stage1-msvc/common/
	mkdir -p ./stage1-msvc/protos/
	cp -rf ../protos/* ./stage1-msvc/protos/
	mkdir -p ./stage1-msvc/keys/
	cp -rf ../keys/* ./stage1-msvc/keys/
	$(MAKE) -C ./stage1-msvc k8s-build

k8s-create-stage1-istio-prem-1: env
k8s-create-stage1-istio-prem-1: SERVICE_NAME=stage1-dep-istio
k8s-create-stage1-istio-prem-1: APP=${SERVICE_NAME}
k8s-create-stage1-istio-prem-1: REPLICAS=1
k8s-create-stage1-istio-prem-1: LOG_LEVEL=debug
k8s-create-stage1-istio-prem-1: CLUSTER=prem-1
k8s-create-stage1-istio-prem-1: ZONE=zp
k8s-create-stage1-istio-prem-1: VERSION=v1
k8s-create-stage1-istio-prem-1: 
	${ROOT_SRC_DIR}/tools/templ.js --templ=stage1-dep-istio.templ.yaml --data='{ "service-name" : "$(SERVICE_NAME)", "cluster" : "$(CLUSTER)", "zone" : "$(ZONE)", "replicas" : "$(REPLICAS)", "log-level" : "${LOG_LEVEL}", "app" : "${APP}", "cluster" : "${CLUSTER}", "version" : "${VERSION}" }' --file=${SERVICE_NAME}-${CLUSTER}-${ZONE}.yaml
	kubectl create -f ./${SERVICE_NAME}-${CLUSTER}-${ZONE}.yaml

k8s-delete-stage1-istio-prem-1: SERVICE_NAME=stage1-dep-istio
k8s-delete-stage1-istio-prem-1: CLUSTER=prem-1
k8s-delete-stage1-istio-prem-1: ZONE=zp
k8s-delete-stage1-istio-prem-1:
	kubectl delete -f ./${SERVICE_NAME}-${CLUSTER}-${ZONE}.yaml



##
## ISTIO STAGE1-PREM-2
##
k8s-build-stage1-istio-prem-2:
	mkdir -p ./stage1-msvc/common/
	cp -rf ../common/* ./stage1-msvc/common/
	mkdir -p ./stage1-msvc/protos/
	cp -rf ../protos/* ./stage1-msvc/protos/
	mkdir -p ./stage1-msvc/keys/
	cp -rf ../keys/* ./stage1-msvc/keys/
	$(MAKE) -C ./stage1-msvc k8s-build

k8s-create-stage1-istio-prem-2: env
k8s-create-stage1-istio-prem-2: SERVICE_NAME=stage1-dep-istio
k8s-create-stage1-istio-prem-2: APP=${SERVICE_NAME}
k8s-create-stage1-istio-prem-2: REPLICAS=1
k8s-create-stage1-istio-prem-2: LOG_LEVEL=debug
k8s-create-stage1-istio-prem-2: CLUSTER=prem-2
k8s-create-stage1-istio-prem-2: ZONE=zp
k8s-create-stage1-istio-prem-2: VERSION=v1
k8s-create-stage1-istio-prem-2: 
	${ROOT_SRC_DIR}/tools/templ.js --templ=stage1-dep-istio.templ.yaml --data='{ "service-name" : "$(SERVICE_NAME)", "cluster" : "$(CLUSTER)", "zone" : "$(ZONE)", "replicas" : "$(REPLICAS)", "log-level" : "${LOG_LEVEL}", "app" : "${APP}", "cluster" : "${CLUSTER}", "version" : "${VERSION}" }' --file=${SERVICE_NAME}-${CLUSTER}-${ZONE}.yaml
#	kubectl create -f ./${SERVICE_NAME}-${CLUSTER}-${ZONE}.yaml
	kubectl replace -f ./${SERVICE_NAME}-${CLUSTER}-${ZONE}.yaml

k8s-delete-stage1-istio-prem-2: SERVICE_NAME=stage1-dep-istio
k8s-delete-stage1-istio-prem-2: CLUSTER=prem-2
k8s-delete-stage1-istio-prem-2: ZONE=zp
k8s-delete-stage1-istio-prem-2:
	kubectl delete -f ./${SERVICE_NAME}-${CLUSTER}-${ZONE}.yaml
















