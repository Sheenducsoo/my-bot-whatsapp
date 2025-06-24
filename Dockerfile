# Imagen base: Node 18 con Debian Buster
FROM node:18-buster

# Instalar librerías necesarias para Puppeteer
RUN apt-get update && apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1 \
    libxdamage1 libxrandr2 libgbm1 libasound2 libpangocairo-1.0-0 \
    libxss1 libgconf-2-4 libgtk-3-0 libgdk-pixbuf2.0-0 libx11-xcb1 \
    libxcb1 libxext6 libxfixes3 libxi6 libgl1 libglib2.0-0

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias npm
RUN npm install

# Copiar el resto de archivos
COPY . .

# Exponer puerto 3000
EXPOSE 3000

# Comando para arrancar la app
CMD ["node", "index.js"]
