 # Usa una imagen base de Node.js 22
 FROM node:22

 # Establece el directorio de trabajo
 WORKDIR /usr/src/app
 
 # Copia el package.json y el package-lock.json
 COPY package*.json ./
 
 # Instala las dependencias
 RUN npm install
 
 # Copia el resto de la aplicación
 COPY . .
 
 # Compila el TypeScript
 RUN npm run build
 
 # Expone el puerto que la aplicación usará
 EXPOSE 8080
 
 # Define el comando para ejecutar la aplicación en modo producción
 CMD ["npm", "run", "start:prod"]