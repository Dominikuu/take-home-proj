FROM mongo:4.2
COPY init-mongo.sh /docker-entrypoint-initdb.d/init-mongo.sh
RUN pwd
RUN chmod +x /docker-entrypoint-initdb.d/init-mongo.sh
# RUN sh /docker-entrypoint-initdb.d/init-mongo.sh