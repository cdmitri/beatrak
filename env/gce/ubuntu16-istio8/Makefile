export VM_USER=cdmitri

export KUBECTL_V=1.10.3
export KUBEADM_V=1.10.3
export KUBELET_V=1.10.3
export DOCKER_V=17.03.2

setup:
	sudo bash -c "bash ./bootstrap.sh"

setup-user:
	sudo bash -c "bash ./vm-user.sh cdmitri"

setup-extra:
	sudo bash -c "bash ./extra.sh"

setup-istio:
	sudo bash -c "bash istio.sh cdmitri"
	kubectl label namespace default istio-injection=enabled

setup-prereq:
	sudo bash -c "echo "vm.max_map_count=262144" >> /etc/sysctl.conf"
	sudo sysctl -w vm.max_map_count=262144
	sudo bash -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
	sudo wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
	sudo apt-get update -y
	sudo apt-get install -y postgresql-client-10
	sudo chmod a+rwx /usr/lib/node_modules
	sudo npm install --global handlebars handlebars-intl yargs dotenv


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
