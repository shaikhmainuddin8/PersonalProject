FROM node:18-slim

# Install Python and pip, and venv module
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Set the working directory for the overall application inside the container
WORKDIR /app

# Copy application code for both Node.js and Python
COPY node-app ./node-app
COPY python-api ./python-api

# Install Node.js dependencies
WORKDIR /app/node-app
RUN npm install --production

# Install Python dependencies in a virtual environment
WORKDIR /app/python-api
# Create a virtual environment named 'venv'
RUN python3 -m venv venv
# Activate the virtual environment and then install dependencies
# The 'source venv/bin/activate' part ensures subsequent commands use the venv's pip
RUN . venv/bin/activate && pip install --no-cache-dir -r requirements.txt

# Go back to the root application directory
WORKDIR /app

# Expose both ports that the Node.js (3000) and Python (8000) apps will listen on
EXPOSE 3000
EXPOSE 8000

# The command to run when the container starts.
# This directly starts the Node.js application, which then spawns the Python API.
# Ensure that 'uvicorn' is called using the virtual environment's executable
CMD ["node", "node-app/index.js"]
