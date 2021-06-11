ARG DOCKER_REGISTRY
FROM $DOCKER_REGISTRY/node:16.1.0-oracle

LABEL name="kitchen"
LABEL maintainer="mustordont@gmail.com"

COPY ./dist/apps /kitchen
COPY ./tools/prod-api-deps /kitchen/api

ENV PORT=4000
# Expose the port the app runs in
EXPOSE 4000

WORKDIR /kitchen/api
RUN npm ci

USER node

CMD ["node", "main.js"]
