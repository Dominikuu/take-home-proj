# Backend

## Transform dataset to seed csv
```
node db_seed_parsing.js
```

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
## Test
### List many data
/composation-data?fields=[FIELD ARRAY]&sort=[SORT ARRAY]&sort=[SORTED ARRAY]&[FIELD](['gte'/'gt'/'lte'/'lt'/'ne])

#### Find single data by id
/composation-data/:ID?fields=[FIELD ARRAY]

## Other issue
- gen_random_uuid is supported after postgresql 13.0
- Version of library "pg" must be 8.x.x
