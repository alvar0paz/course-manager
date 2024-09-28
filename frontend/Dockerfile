# Use Node.js v18 as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock (if it exists)
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN yarn build

# Install serve to run the application
RUN yarn global add serve

# Expose port 3000 for the application
EXPOSE 3000

# Command to run the application
CMD ["serve", "-s", "build", "-l", "3000"]