# SvelteKit Dockerfile
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the SvelteKit app
RUN npm run build

# Set the FastAPI base URL
ENV VITE_FAST_API_BASE_URL=$VITE_FAST_API_BASE_URL

# Expose port
EXPOSE 4173

# Start the app
CMD ["npm", "run", "preview"]