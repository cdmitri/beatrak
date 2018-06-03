export ROOT_SRC_DIR := ${PWD}

# Set EXT_SVC_NODEPORT=1 to generate external services as NodePort type
#    Ex: "make ... EXT_SVC_NODEPORT=1"
export EXT_SVC_NODEPORT :=

# Set EXT_SVC_IP=<IP addr> to generate external services' IP
#    Ex: "make ... EXT_SVC_IP=10.138.0.21"
export EXT_SVC_IP := 10.0.2.15

all:
env: 
	$(eval export NODE_PATH=$(shell npm get prefix)/lib/node_modules:${ROOT_SRC_DIR}/src/common)

locpick-build:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/locpick k8s-build-locpick-istio

locpick-create:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/locpick k8s-create-locpick-istio

locpick-delete:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/locpick k8s-delete-locpick-istio

#
# BEACON
#

beacon-build:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/beacon k8s-build-beacon-istio-zfl

beacon-create:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/beacon k8s-create-beacon-istio-zfl

beacon-delete:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/beacon k8s-delete-beacon-istio-zfl

# devshell
beacon-build-devshell:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/beacon k8s-build-devshell-istio

beacon-create-devshell:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/beacon k8s-create-devshell-istio

beacon-shell-devshell:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/beacon k8s-shell-devshell-istio

beacon-delete-devshell:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/beacon k8s-delete-devshell-istio

#
# STAGE1
#

stage1-build: TARGET=prod
stage1-build:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/stage1 build

stage1-create:
	kubectl create -f src/stage1/rr/work-06-prem-cloud/stage1-dep-istio-prem-cloud.yaml

stage1-delete:
	kubectl delete -f src/stage1/rr/work-06-prem-cloud/stage1-dep-istio-prem-cloud.yaml

