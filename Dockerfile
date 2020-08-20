# Build stage
FROM node:10-buster as builder

# Copy over source files
COPY . .

# Install dependencies
RUN yarn install

# Build site
RUN yarn build --environment production

# Assemble our materials
RUN mkdir copyme && \
  # Isn't this a neat little syntax
  mv -t copyme dist fastboot fastboot_server

# Final stage
FROM node:10-alpine

# Copy our compiled output over here
COPY --from=builder copyme .

# Install runtime dependencies
# I found these by building and searching through dist/ for require\(("\D+")\)
# And just rebuilding the image until it worked
# So...they might...not...be right...
RUN yarn add \
  moment@^2.19.3 \
  moment-timezone@^0.5.13 \
  abortcontroller-polyfill@^1.4.0 \
  node-fetch@^2.6.0 \
  fastboot-app-server@2.0.0

# Get rid of our extra stuff to shave some bytes off the image
RUN rm -rf \
  package.json \
  yarn.lock \
  /usr/local/share/.cache/yarn

# Open the port we're gonna be listening on
EXPOSE 3000

CMD [ "node", "fastboot_server/server.js" ]
