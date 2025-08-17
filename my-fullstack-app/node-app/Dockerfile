# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
# This step is critical for npm install
COPY package*.json ./

# Install app dependencies
# We'll add 'set -x' to make npm install more verbose
RUN set -x && npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 for the Node.js application
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]