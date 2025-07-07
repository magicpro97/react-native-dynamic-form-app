# Dockerfile for React Native Web Frontend (Expo/Next.js)
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

# Build static web (Expo/Next.js)
RUN npx expo export:web

EXPOSE 8081

CMD ["npx", "expo", "start", "--web", "--non-interactive", "--port", "8081"]
