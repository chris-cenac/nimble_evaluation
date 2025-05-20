FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the Cloud Run port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production

# Start the app
CMD ["node", "server.js"]
