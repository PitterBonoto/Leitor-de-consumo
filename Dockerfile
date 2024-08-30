# Etapa 1: Construção
FROM node:18-alpine AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código da aplicação para o diretório de trabalho
COPY . .

# Compila o projeto TypeScript
RUN npm run build

# Etapa 2: Execução
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia as dependências instaladas da etapa de construção
COPY --from=build /app/node_modules ./node_modules

# Copia o código compilado para o diretório de trabalho
COPY --from=build /app/dist ./dist


# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]
