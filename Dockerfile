# Stage 1: Build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Declarar ARGs para que o Vite possa injetá-los no build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Copiar apenas os arquivos de dependências primeiro (otimiza cache)
COPY package*.json ./

# Instalar TODAS as dependências (necessário para o comando 'build')
RUN npm install

# Copiar o restante do código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Servir com Nginx
FROM nginx:alpine

# Copiar arquivos build para o nginx (Vite usa a pasta 'dist')
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]