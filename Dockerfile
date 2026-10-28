# Usa una imagen de Node.js
FROM node:22

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json antes de instalar dependencias
# (se instalan también las de desarrollo porque Vite compila el cliente React)
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Verifica tipos (cliente y servidor), compila el cliente React (Jeatdeam/client/dist)
# y deja solo dependencias de producción (tsx queda para ejecutar el servidor TypeScript)
RUN npm run build && npm prune --omit=dev

# Expone el puerto 8080 (ajústalo según tu configuración)
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npx", "tsx", "Jeatdeam/app.ts"]
