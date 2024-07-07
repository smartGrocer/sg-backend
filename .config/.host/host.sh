# bin/bash

# Update and upgrade
sudo apt update && sudo apt upgrade -y

# Firewall
sudo ufw status
sudo ufw enable
sudo ufw allow "Nginx HTTPS"
sudo ufw delete allow "Nginx Full"
sudo ufw delete allow "Nginx HTTP"
sudo ufw allow 22
sudo ufw status

# create a new user
sudo adduser perei
# set password
# sudo passwd password
# Add user to sudo group
sudo usermod -aG sudo perei

# SSH
ssh-keygen -C "email@email.com"
cat ~/.ssh/id_rsa.pub # copy and paste to github settings https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account

# get private key to put into repo? settings>secrets>actions> SSH_PRIVATE_KEY
cat ~/.ssh/id_rsa # paste into github actions secret

# get public key and paste it into ~/.ssh/authorized_keys
cat ~/.ssh/id_rsa.pub # copy and paste into ~/.ssh/authorized_keys on server

# install docker
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install Docker packages
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin


####################
# initial setup should be done
####################

# make sure github actions is working and server is running on port 8000 or something
# It should also have nginx-proxy-manager running on port 81
# and the server should be running on port 8000

# in nginx-proxy-manager, create a new ssl certificate for the domain
# in dns provider, create a new A record for the domain pointing to the server's ip address

# create docker network for nginx-proxy-manager
docker network create nginx-proxy-network

# resources for setting up nginx-proxy-manager
# https://www.youtube.com/watch?v=P3imFC7GSr0
# https://www.youtube.com/watch?v=bKFMS5C4CG0



