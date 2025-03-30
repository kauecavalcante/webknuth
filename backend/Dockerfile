FROM node:18

# Cria e define diretório de trabalho
WORKDIR /app

# Copia todos os arquivos
COPY . .

# Instala as dependências
RUN npm install

# Expõe a porta da API
EXPOSE 5000

# Comando para iniciar em modo dev
CMD ["npm", "run", "start:dev"]
