#!/usr/bin/env bash

export LANGUAGE=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

sudo locale-gen en_US.UTF-8
sudo dpkg-reconfigure locales

sudo apt-get update > /dev/null
sudo apt-get install -y make mc htop vim curl python-software-properties

# install mysql server

sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'

sudo apt-get -y install mysql-server

sed -i "s/^bind-address/#bind-address/" /etc/mysql/my.cnf
mysql -u root -proot -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION; FLUSH PRIVILEGES;"
sudo /etc/init.d/mysql restart

# install redis server

sudo mkdir -p /opt/redis
cd /opt/redis

sudo wget -q http://download.redis.io/redis-stable.tar.gz
sudo tar -xz --keep-newer-files -f redis-stable.tar.gz

cd redis-stable
sudo make
sudo make install
sudo rm /etc/redis.conf
sudo mkdir /etc/redis
sudo mkdir /var/redis
sudo chmod -R 777 /var/redis
sudo useradd redis

sudo cp -u /vagrant/redis.conf /etc/redis/redis.conf
sudo cp -u /vagrant/redis.rc /etc/init.d/redis

sudo update-rc.d redis defaults

sudo chmod a+x /etc/init.d/redis
sudo invoke-rc.d redis restart
