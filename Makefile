export ROOT_SRC_DIR := ${PWD}

# Set EXT_SVC_NODEPORT=1 to generate external services as NodePort type
#    Ex: "make ... EXT_SVC_NODEPORT=1"
export EXT_SVC_NODEPORT :=

# Set EXT_SVC_IP=<IP addr> to generate external services' IP
#    Ex: "make ... EXT_SVC_IP=10.138.0.21"
export EXT_SVC_IP := 10.138.0.5

all:

.PHONY: env
env: 
	$(eval export NODE_PATH=$(shell npm get prefix)/lib/node_modules:${ROOT_SRC_DIR}/src/common)
	echo "ENV: NODE_PATH=${NODE_PATH}"

build-all:
	$(MAKE) keys
	$(MAKE) node-base-build
	$(MAKE) common-build
	$(MAKE) locpick-build
	$(MAKE) beacon-build
	$(MAKE) stage1-build
	$(MAKE) montrer-envoy-build
	$(MAKE) montrer-build
	$(MAKE) elastic-build
	$(MAKE) grafana-build
	$(MAKE) postgresql-build

installgen: env
	-$(MAKE) elastic-installgen
	-$(MAKE) postgresql-installgen
	-$(MAKE) grafana-installgen
	-$(MAKE) montrer-installgen


#
# COMMON
#
common-build:
	cd ${ROOT_SRC_DIR}/src/common; yarn install


#
# NODE-BASE
#
node-base-build:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/node-base/alpine-node build
	$(MAKE) -C ${ROOT_SRC_DIR}/src/node-base build

node-base-clean:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/node-base/alpine-node clean
	$(MAKE) -C ${ROOT_SRC_DIR}/src/node-base clean

#
# ELASTIC
#

elastic-build:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/elastic build

elastic-create:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/elastic create

elastic-delete:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/elastic delete

elastic-installgen: env
	$(MAKE) -C ${ROOT_SRC_DIR}/src/elastic k8s-installgen


#
# GRAFANA
#

grafana-build:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/grafana build

grafana-create:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/grafana create

grafana-delete:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/grafana delete

grafana-installgen: env
	$(MAKE) -C ${ROOT_SRC_DIR}/src/grafana k8s-installgen


#
# POSTGRESQL
#

postgresql-build:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/postgresql build

postgresql-create:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/postgresql create

postgresql-gen:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/postgresql gen

postgresql-delete:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/postgresql delete

postgresql-run-shell:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/postgresql shell

postgresql-run-client:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/postgresql client

postgresql-installgen: env
	$(MAKE) -C ${ROOT_SRC_DIR}/src/postgresql k8s-installgen

#
# MONTRER
#

montrer-envoy-build: export TARGET=envoy
montrer-envoy-build:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/montrer build

montrer-envoy-create: export TARGET=envoy
montrer-envoy-create:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/montrer create

montrer-envoy-delete: export TARGET=envoy
montrer-envoy-delete:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/montrer delete


montrer-build: export TARGET=prod
montrer-build:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/montrer build

montrer-create: export TARGET=prod
montrer-create:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/montrer create

montrer-delete: export TARGET=prod
montrer-delete:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/montrer delete

montrer-installgen: env
	$(MAKE) -C ${ROOT_SRC_DIR}/src/montrer k8s-installgen

#
# MONTRER-DEVSHELL
#
# cd cd src/montrer
# make k8s-build-devshell
# make k8s-create-devshell
# make k8s-shell-devshell
# make k8s-delete-devshell
#


#
# KEYS/CERTS
#
keys: 
	$(MAKE) -C ${ROOT_SRC_DIR}/src/keys all


#
# LOCPICK
#
locpick-build: common-build
	cd ${ROOT_SRC_DIR}/src/locpick/locpick-msvc/app; yarn; cd -
	$(MAKE) -C ${ROOT_SRC_DIR}/src/locpick k8s-build-locpick-istio

locpick-create:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/locpick k8s-create-locpick-istio

locpick-delete:
	$(MAKE) -C ${ROOT_SRC_DIR}/src/locpick k8s-delete-locpick-istio


#
# BEACON
#

beacon-build: common-build
	cd ${ROOT_SRC_DIR}/src/beacon/beacon-msvc/app; yarn
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

stage1-build: export TARGET=prod
stage1-build: common-build
stage1-build:
	cd ${ROOT_SRC_DIR}/src/stage1/stage1-msvc/app; yarn; cd -
	$(MAKE) -C ${ROOT_SRC_DIR}/src/stage1 build

stage1-create:
	kubectl create -f src/stage1/rr/work-08-clus/stage1-service.yaml

stage1-delete:
	kubectl delete -f src/stage1/rr/work-08-clus/stage1-service.yaml


###-----------------------------------------------------------------------------
### CLUS
###-----------------------------------------------------------------------------


show:
	kubectl get pods -Lapp,version,cluster,zone  --watch | grep clus-istio

rr-show:
	kubectl get routerules

rr-delete:
	kubectl delete routerules beacon-to-service

rr-create-1-prem-50-50:
	kubectl create -f src/stage1/rr/work-08-clus/rr-prem-50-50.yaml

rr-create-2-prem-1-only:
	kubectl replace -f src/stage1/rr/work-08-clus/rr-prem-1-only.yaml

rr-create-3-cloud-10-canary:
	kubectl replace -f src/stage1/rr/work-08-clus/rr-cloud-10-canary.yaml

rr-create-4-cloud-prem-50-50:
	kubectl replace -f src/stage1/rr/work-08-clus/rr-cloud-prem-50-50.yaml



