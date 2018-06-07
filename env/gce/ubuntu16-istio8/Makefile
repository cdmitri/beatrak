export VM_USER=cdmitri

export KUBECTL_V=1.10.3
export KUBEADM_V=1.10.3
export KUBELET_V=1.10.3
export DOCKER_V=17.03.2

setup:
	sudo bash -c "bash ./bootstrap.sh"

setup-user:
	sudo bash -c "bash ./vm-user.sh cdmitri"

setup-istio:
	sudo bash -c "bash istio.sh cdmitri"

#stop:
#	vagrant halt
#prov:
#	vagrant provision
#delete:
#	vagrant destroy
#ssh:
#	vagrant ssh
#
#shell:
#	ssh -p 2222 ${VM_USER}@localhost
