# HOSTNAME := $(shell hostname)

.PHONY: env
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
TARGET = devshell-istio
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
	@echo "- ex.: $$ TARGET=prod make build"
	@echo "-      $$ TARGET=devshell make shell"
	@echo "-"
	@echo "-"
	@echo "-"
	@echo "----------------------------------------"

#
# TOP
#
build: env banner k8s-build-${TARGET}
create: env banner k8s-create-${TARGET}
delete: env banner k8s-delete-${TARGET}
shell: env banner k8s-shell-${TARGET}

#
# K8S PROD
#
k8s-build-prod:
	sudo mkdir -p ./locpick-msvc/common/
	sudo cp -rf ../common/* ./locpick-msvc/common/
	$(MAKE) -C ./locpick-msvc k8s-build
	$(MAKE) -C ./locpick-envoy k8s-build


k8s-create-prod: env
k8s-create-prod: REPLICAS=1
k8s-create-prod: LOG_LEVEL=error
k8s-create-prod: SERVICE_NAME=locpick-dep-hlsvc
k8s-create-prod: APP=locpick-dep-hlsvc
k8s-create-prod:
	${ROOT_SRC_DIR}/tools/templ.js --templ=locpick-dep-hlsvc.templ.yaml --data='{ "service-name" : "${SERVICE_NAME}", "app" : "${APP}", "log-level" : "${LOG_LEVEL}", "replicas" : ${REPLICAS} }' --file=locpick-dep-hlsvc.yaml
	kubectl create -f ./locpick-dep-hlsvc.yaml

k8s-delete-prod:
	kubectl delete -f ./locpick-dep-hlsvc.yaml

#
# K8S DEVSHELL-POD
#
k8s-build-devshell:
	$(MAKE) -C ./locpick-msvc k8s-build-devshell

#k8s-build-devshell-istio:
#	$(MAKE) -C ./locpick-msvc k8s-build-devshell

k8s-create-devshell: env
k8s-create-devshell: LOG_LEVEL=error
k8s-create-devshell: SERVICE_NAME=locpick-devshell
k8s-create-devshell: APP=locpick-devshell
#k8s-create-devshell: APP_VOLUME_PATH=${ROOT_SRC_DIR}/src/locpick/locpick-msvc/app
#k8s-create-devshell: COMMON_VOLUME_PATH=${ROOT_SRC_DIR}/src/common
k8s-create-devshell: BEATRAK_VOLUME_PATH=${ROOT_SRC_DIR}
k8s-create-devshell:
	${ROOT_SRC_DIR}/tools/templ.js --templ=locpick-devshell-pod.templ.yaml --data='{ "service-name" : "${SERVICE_NAME}", "app" : "${APP}", "log-level" : "${LOG_LEVEL}", "hostname" : "${HOSTNAME}", "beatrak-volume-path" : "${BEATRAK_VOLUME_PATH}" }' --file=locpick-devshell-pod.yaml
	kubectl create -f ./locpick-devshell-pod.yaml


#
# K8S DEVSHELL-ISTIO
#
k8s-create-devshell-istio: env
k8s-create-devshell-istio: LOG_LEVEL=error
k8s-create-devshell-istio: SERVICE_NAME=locpick-devshell
k8s-create-devshell-istio: APP=locpick-devshell
k8s-create-devshell-istio: BEATRAK_VOLUME_PATH=${ROOT_SRC_DIR}
k8s-create-devshell-istio: 
	${ROOT_SRC_DIR}/tools/templ.js --templ=locpick-devshell-istio.templ.yaml --data='{ "service-name" : "${SERVICE_NAME}", "app" : "${APP}", "log-level" : "${LOG_LEVEL}", "hostname" : "${HOSTNAME}", "beatrak-volume-path" : "${BEATRAK_VOLUME_PATH}" }' --file=locpick-devshell-istio.yaml
	kubectl create -f ./locpick-devshell-istio.yaml

k8s-delete-devshell-istio: 
	kubectl delete -f ./locpick-devshell-istio.yaml

#
# K8S DEVSHELL-POD
#
k8s-build-devshell-pod:
	$(MAKE) -C ./locpick-msvc k8s-build-devshell

k8s-create-devshell-pod: env
k8s-create-devshell-pod: LOG_LEVEL=error
k8s-create-devshell-pod: SERVICE_NAME=locpick-devshell
k8s-create-devshell-pod: APP=locpick-devshell
k8s-create-devshell-pod: APP_VOLUME_PATH=${ROOT_SRC_DIR}/locpick/locpick-msvc/app
k8s-create-devshell-pod: COMMON_VOLUME_PATH=${ROOT_SRC_DIR}/common
k8s-create-devshell-pod:
	${ROOT_SRC_DIR}/tools/templ.js --templ=locpick-devshell-pod.templ.yaml --data='{ "service-name" : "${SERVICE_NAME}", "app" : "${APP}", "log-level" : "${LOG_LEVEL}", "hostname" : "${HOSTNAME}", "app-volume-path" : "${APP_VOLUME_PATH}", "common-volume-path" : "${COMMON_VOLUME_PATH}" }' --file=locpick-devshell-pod.yaml
	kubectl create -f ./locpick-devshell-pod.yaml

k8s-delete-devshell-pod: 
	kubectl delete -f ./locpick-devshell-pod.yaml

k8s-delete-devshell-pod: 
	kubectl delete -f ./locpick-devshell-pod.yaml

# run [beatrak/locpick-devshell]# /start-dev.sh"
# LOG_LEVEL= {trace|debug|info|warn|error}
k8s-shell-devshell-istio: LOG_LEVEL=debug
k8s-shell-devshell-istio:
	kubectl exec -it $$(kubectl get pods -n default -o 'jsonpath={.items[?(@.metadata.labels.app=="locpick-devshell")].metadata.name}') -c locpick-devshell -- /bin/bash -l -c "LOG_LEVEL=$(LOG_LEVEL) exec -l /bin/bash"

# run [beatrak/locpick-devshell]# /start-dev.sh"
# LOG_LEVEL= {trace|debug|info|warn|error}
k8s-shell-devshell-pod: LOG_LEVEL=debug
k8s-shell-devshell-pod:
	@echo "//---------------------------------------------------------------"
	@echo "// ROOT_SRC_DIR=${ROOT_SRC_DIR}"
	@echo "// config=${ROOT_SRC_DIR}/locpick/locpick-devshell-pod.yaml"
	@echo " //"
	@echo "// devshell: (development shell)"
	@echo "//   will run on HOSTNAME="${HOSTNAME}" machine"
	@echo "//   locpick-devshell:~/app# /start-dev.sh"
	@echo "// jest: (testing)"
	@echo "//   open different terminal and run"
	@echo "//    locpick-devshell:~/app# ./jest.js --watchAll [--no-colors]"
	@echo "//---------------------------------------------------------------"

	kubectl exec locpick-devshell --container locpick-devshell -i -t -- /bin/bash -l -c "LOG_LEVEL=$(LOG_LEVEL) exec -l /bin/bash"


##
## ISTIO
##
k8s-build-devshell-istio:
	sudo mkdir -p ./locpick-msvc/common/
	sudo cp -rf ../common/* ./locpick-msvc/common/
	sudo mkdir -p ./locpick-msvc/protos/
	sudo cp -rf ../protos/* ./locpick-msvc/protos/
	sudo mkdir -p ./locpick-msvc/keys/
	sudo cp -rf ../keys/* ./locpick-msvc/keys/
	$(MAKE) -C ./locpick-msvc k8s-build-devshell


k8s-build-locpick-istio:
	sudo mkdir -p ./locpick-msvc/common/
	sudo cp -rf ../common/* ./locpick-msvc/common/
	sudo mkdir -p ./locpick-msvc/protos/
	sudo cp -rf ../protos/* ./locpick-msvc/protos/
	sudo mkdir -p ./locpick-msvc/keys/
	sudo cp -rf ../keys/* ./locpick-msvc/keys/
	$(MAKE) -C ./locpick-msvc k8s-build


k8s-create-locpick-istio: env
k8s-create-locpick-istio: REPLICAS=1
k8s-create-locpick-istio: LOG_LEVEL=error
k8s-create-locpick-istio: SERVICE_NAME=locpick-dep-istio
k8s-create-locpick-istio: APP=${SERVICE_NAME}
k8s-create-locpick-istio:
	${ROOT_SRC_DIR}/tools/templ.js --templ=locpick-dep-istio.templ.yaml --data='{ "service-name" : "${SERVICE_NAME}", "app" : "${APP}", "log-level" : "${LOG_LEVEL}", "replicas" : ${REPLICAS} }' --file=locpick-dep-istio.yaml
	kubectl create -f ./${SERVICE_NAME}.yaml

k8s-delete-locpick-istio: SERVICE_NAME=locpick-dep-istio
k8s-delete-locpick-istio:
	kubectl delete -f ./${SERVICE_NAME}.yaml

k8s-shell-locpick-istio:
	kubectl exec -it $$(kubectl get pods -n default -o 'jsonpath={.items[?(@.metadata.labels.app=="locpick-dep-istio")].metadata.name}') -c locpick-prod -- /bin/bash -l -c "LOG_LEVEL=$(LOG_LEVEL) exec -l /bin/bash"
