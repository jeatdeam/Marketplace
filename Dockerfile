# Usa una imagen de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json antes de instalar dependencias
COPY package.json package-lock.json ./

# Instala solo las dependencias de producción
RUN npm install --production

# Copia el resto del código
COPY . .

# Expone el puerto 8080 (ajústalo según tu configuración)
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["node", "Jeatdeam/app.mjs"]
