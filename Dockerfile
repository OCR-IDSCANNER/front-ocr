# Étape 1 : Construction de l'application Angular
FROM node:22 as build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances avec l'option legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application Angular en mode production
RUN npm run build --prod --skip-tests

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine

# Copier les fichiers de build Angular vers le dossier Nginx
COPY --from=build /app/dist/front-ocr /usr/share/nginx/html
# Copier la configuration personnalisée de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
