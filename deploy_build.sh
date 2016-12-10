#!/bin/sh

# Deploys build version to Rameplayer device.
# Make build first by running 'gulp build'.
#
# Usage:   ./deploy_build.sh IP
# Example: ./deploy_build.sh 192.168.1.5
#
# Note:
# You need to have your SSH public key installed in device

if [ -z "$1" ]; then
	echo "Usage:   ./deploy_build.sh host"
	echo "Example: ./deploy_build.sh 192.168.1.5"
	exit 1
fi

IP=$1
rsync -avz build/* root@$IP:/usr/share/rameplayer-webui/www ; ssh root@$IP 'cd /usr/share/rameplayer-webui ; rc-service httpd restart'

echo "Open http://$IP/"
