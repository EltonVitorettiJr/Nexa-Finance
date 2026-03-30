# Usa uma versão leve do Node 20
FROM node:20-slim

# Define a pasta de trabalho
WORKDIR /app

# Instala o OpenSSL (Necessário para o Prisma funcionar no Linux Slim)
RUN apt-get update -y && apt-get install -y openssl

# Copia os arquivos de dependências
COPY package.json ./

# Instala as dependências (agora incluindo o tsx)
RUN npm install

# Copia a pasta do Prisma e gera o cliente
COPY prisma ./prisma/
RUN npx prisma generate

# Copia todo o resto do código
COPY . .

# Expõe a porta 3000
EXPOSE 3000

# Inicia usando o tsx
CMD ["npm", "run", "start"]