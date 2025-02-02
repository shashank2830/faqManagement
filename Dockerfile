# Use official Node.js image from Docker Hub
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port (3000 for example)
EXPOSE 5000

# Run the application
CMD ["npm", "start"]
