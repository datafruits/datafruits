FROM node:10-alpine

# Install git
RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

# Copy over source files
COPY . .

# Install dependencies
RUN yarn

# Build site
RUN yarn build --environment production

# Open the port we're gonna be listening on
EXPOSE 3000

CMD [ "node", "fastboot_server/server.js" ]

# TODO:
# Trim this by using a builder image that has git installed, and then have the second image
# just have node installed alongside whatever production dependencies we need.
# This would involve moving some stuff into `dependencies` from `devDependencies` and
# then running yarn install --production
