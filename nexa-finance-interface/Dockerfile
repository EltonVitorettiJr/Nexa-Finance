# Etapa 1: Build
FROM node:20-slim AS build

WORKDIR /app

# Copia dependências
COPY package.json ./
RUN npm install

# Copia o código
COPY . .

# --- O SEGREDO DO VITE ---
# Pega a variável do EasyPanel e passa para o build
# VITE
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# FIREBASE
ARG VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY

ARG VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN

ARG VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID

ARG VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET

ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID

ARG VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
# -------------------------

# Gera o build de produção
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine

# Copia os arquivos gerados
COPY --from=build /app/dist /usr/share/nginx/html

# Configura o Nginx para Single Page Application (React)
# Isso evita erro 404 ao atualizar a página
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]