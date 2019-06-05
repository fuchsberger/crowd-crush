[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Crowd Crush

## Versioning
x.y.z

  * x: Major Release (Edeliver Release)
  * y: Major Update, or update including a database change (Edeliver Release)
  * z: Minor Update (Edeliver Upgrade)

## Installation and getting server running (dev)

To install in a fresh cloud9 development environment

* needs github authorization
* assumes blank cloud9 workspace with ubuntu 14.04 (trusty)


```
sudo touch /etc/init.d/couchdb
wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb
sudo dpkg -i erlang-solutions_1.0_all.deb
sudo apt-get update
sudo apt-get install elixir
mix local.hex
sudo apt-get install erlang
nvm install stable
nvm alias default stable
sudo apt-get install erlang-base-hipe erlang-dev erlang-eunit erlang-parsetools
sudo apt-get install inotify-tools
sudo nano /etc/apt/sources.list.d/pgdg.list

### add the following to the file ###########################
# PostgreSQL repository
deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main
#############################################################

sudo su
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt-get update -y
apt-get install postgresql-9.5 -y
apt-get purge postgresql-9.3

nano /etc/postgresql/9.5/main/postgresql.conf

### change the following line to this port ##################
port = 5432
#############################################################
```

Before starting app for the first time or when dependencies changed:

```
mix deps.get
npm install
sudo service postgresql start
mix ecto.create && mix ecto.migrate
```

To start Phoenix app after already installed:

```
sudo service postgresql start
mix phoenix.server
```

Now you can visit [`localhost:8080`](http://localhost:8080) from your browser.

## Command Cheat Sheet

* `mix ecto.gen.migration file_name` Create Database Migration File
* `mix ecto.migrate` Incorporates Changes at priv/repo/migrations/\*file_name)
