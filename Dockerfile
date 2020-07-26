FROM node:12.14.0-buster AS base

ENV APP_HOME /usr/src/app/
RUN useradd -ms /bin/bash docker

FROM base AS build

USER docker

COPY --chown=docker:docker package.json package-lock.json $APP_HOME
WORKDIR $APP_HOME
RUN npm ci

COPY --chown=docker:docker src $APP_HOME/src/
COPY --chown=docker:docker webpack.config.js $APP_HOME/webpack.config.js
COPY --chown=docker:docker babel.config.js $APP_HOME/babel.config.js

RUN npm run build --production

FROM jasonblanchard/di-fe-server AS release

USER docker
WORKDIR $APP_HOME
COPY --from=build --chown=docker:docker $APP_HOME/build $APP_HOME/public
COPY --from=build --chown=docker:docker $APP_HOME/build/manifest.json $APP_HOME/build/config

EXPOSE 8081

CMD ["npm", "start", "--production"]
