# Artiva Laboral

Sitio web estático y multilingüe de [artivalaboral.com](https://artivalaboral.com), preparado para desplegarse con Cloudflare Workers Static Assets.

## Desarrollo

Requisitos: Node.js 20 o posterior. El proyecto no tiene dependencias externas.

```bash
npm run build
```

El generador escribe la versión publicable en `dist/`.

## Cloudflare

Configurar el proyecto con estos valores:

- Rama de producción: `main`
- Comando de compilación: `npm run build`
- Directorio de salida: `dist`
- Directorio raíz: `/`

El proyecto está conectado a GitHub mediante Cloudflare Workers Builds. Los cambios enviados a `main` generan automáticamente un nuevo despliegue de los recursos estáticos de `dist/`.

Despliegue temporal: [artivalaboral.danabeo.workers.dev](https://artivalaboral.danabeo.workers.dev). La rama de producción es `main` y está conectada a Cloudflare Workers Builds.

## Dominio

El dominio canónico es `artivalaboral.com`. Conviene añadir también `www.artivalaboral.com` y redirigirlo al dominio raíz desde Cloudflare.

## Formulario

El formulario utiliza el endpoint AJAX de FormSubmit y entrega las consultas a `info@artivalaboral.com`. La confirmación se muestra dentro del propio sitio.
