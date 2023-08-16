# Base image
FROM node:14

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Start app
CMD ["npm", "start"]
