#!/bin/sh

# Deploy development version to Rameplayer device
# Usage:   ./deploy_to_rame.sh IP
# Example: ./deploy_to_rame.sh 192.168.1.5
#
# Note:
# You need to have your SSH public key installed in device

IP=$1
rsync -avz * root@$IP:/usr/share/rameplayer-webui/www ; ssh root@$IP 'cd /usr/share/rameplayer-webui ; cp www/stubs/settings.json www/src/stubs ; /etc/init.d/httpd restart'
echo "Open http://$IP/src"
