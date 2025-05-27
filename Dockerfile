# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

# Expose your app port (adjust if your app uses a different port)
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
