FROM node:18.1-alpine3.14

# Create app directory
# RUN mkdir -p /opt/app
WORKDIR /app
# RUN adduser -S app

# Install app dependencies
RUN npm install -g nodemon
COPY ./package*.json ./

RUN npm install -g npm@8.12.1
RUN npm install
# TEST FIXME
RUN apk update && apk add curl


# Bundle app source
COPY . .
# RUN chown -R app /app
# USER app

# CMD [ "npm", "run", "start" ]
EXPOSE 3032

CMD [ "npm", "run", "start.dev" ]