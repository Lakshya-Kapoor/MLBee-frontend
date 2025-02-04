# 1. Build Stage (using Node.js to build the React app)
FROM node:18-alpine AS build  # Use a Node.js base image (Alpine for smaller size)

WORKDIR /app                  # Set the working directory inside the container

COPY package*.json ./         # Copy package files for dependency installation
RUN npm install || yarn install # Install dependencies (npm or yarn)

COPY . .                     # Copy all project files
RUN npm run build || yarn build   # Build the React app (creates the 'dist' folder)


# 2. Serve Stage (using Nginx to serve the static files)
FROM nginx:alpine             # Use a lightweight Nginx image

COPY --from=build /app/dist /usr/share/nginx/html  # Copy the built files from the build stage
                                                  # to Nginx's HTML directory

EXPOSE 80                    # Expose port 80 (default for Nginx)

CMD ["nginx", "-g", "daemon off;"] # Start Nginx (important: daemon off prevents issues)