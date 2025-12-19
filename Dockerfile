
# Build stage for Frontend
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Final stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Install only production dependencies + tsx for running TS
RUN npm install --omit=dev && npm install tsx typescript

# Copy built frontend
COPY --from=build /app/dist ./dist
# Copy backend server code
COPY server.ts ./
COPY types.ts ./
COPY tsconfig.json ./

# Environment variable placeholder
ENV GEMINI_API_KEY=""
ENV PORT=3000

EXPOSE 3000

# Start the node server using tsx
CMD ["npx", "tsx", "server.ts"]
