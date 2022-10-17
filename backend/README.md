# UnitikOfficialBE


## Tech stack
- flask
- nginx
- MongoDB
-
## Environment setup

```
$ sudo bash ./scripts/provision.sh
```
## Installation
```
# Build images before starting containers
docker-compose up --build -d

# Remove named volumes declared in the `volumes`
docker-compose down -v

```

## Build
```
$ sudo bash ./scripts/build.sh
```

## Deploy
```
# Copy out\utOfficial.tar.gz to target server
# Extract
tar -xf utOfficial.tar.gz
cd utOfficial
sudo bash ./scripts/start.sh
```

## Other issue
```
# Remove usused container
docker container prune
```
## Before commit
```
# Use virtualenv to execuate formatter & liniter
source ./source/bin/activate
```

## DB authenication for auth
Step1.
```
use admin
db.createUser(
  {
    user: *{{ INIT_USER }}*,
    pwd: *{{ INIT_PASSWORD }}*,
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
```

Step2.
```
db.auth(*{{ INIT_USER }}*, *{{ INIT_PASSWORD }}*)
use auth
db.createUser(
  {
    user: *{{ USER }}*,
    pwd: *{{ PASSOWRD }}*,
    roles: [ { role: "readWrite", db: "auth" } ]
  }
)
```
db.createUser(
  {
    user: "unitik",
    pwd: "90699920",
    roles: [ { role: "readWrite", db: "auth" } ]
  }
)
## Redis
Login
```
redis-cli auth [username] [password]
```
Clear all
```
redis-cli flushall
```