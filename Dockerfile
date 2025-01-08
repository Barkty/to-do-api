# Use a Node.js image as the base image
FROM node:20

# Install MongoDB Tools (including mongodump)
RUN apt-get update && apt-get install -y wget gnupg && wget -q https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2404-arm64-100.10.0.tgz && tar -xzf mongodb-database-tools-ubuntu2404-arm64-100.10.0.tgz && mv mongodb-database-tools-*/bin/* /usr/local/bin/ && rm -rf mongodb-database-tools-ubuntu2404-arm64-100.10.0.tgz mongodb-database-tools-* && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

ENV PORT = 6087

# Copy only necessary files
COPY package.json yarn.lock ./
# Copy the application code
COPY . .

# Enable Corepack
RUN corepack enable

# Prepare Yarn
RUN corepack prepare yarn@4.5.3 --activate

# Verify Yarn version
RUN yarn --version

# Install dependencies
RUN yarn install

# Uninstall bcrypt
RUN yarn remove bcrypt

# Install bcrypt
RUN yarn add bcrypt

EXPOSE 9087

# Build the node app
RUN yarn build

# Specify the command to run when the container starts
CMD [ "yarn", "dev" ]
