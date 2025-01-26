## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Variables de Entorno

Para que el backend funcione correctamente, es necesario configurar las siguientes variables de entorno:

- `HOSTNAME` : Host del servidor
- `API_PORT` : Puerto de ejecucion del servidor

- `DATABASE_HOST` : Hot de la base de datos
- `DATABASE_PORT` : Puerto de la base de datos
- `DATABASE_USERNAME` : Usuario de la base de datos
- `DATABASE_PASSWORD` : Password de la base de datos
- `DATABASE_DATABASE` : Nombre de la base de datos

- `GOOGLE_CLIENT_ID ` : Id de cliente proporcionado por Google

Puedes configurar estas variables en un archivo `.env` en la raíz del proyecto. Ejemplo de archivo `.env`:

```env
# Server config
HOSTNAME = 'localhost'
API_PORT = 3001

# Database config
DATABASE_HOST = 'localhost'
DATABASE_PORT = 3306
DATABASE_USERNAME = root
DATABASE_PASSWORD =
DATABASE_DATABASE = fulbitoapp

# Google clientID
GOOGLE_CLIENT_ID = uuid.apps.googleusercontent.com
```
