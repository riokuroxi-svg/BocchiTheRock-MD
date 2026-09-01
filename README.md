# BocchiTheRock-MD

Bot de WhatsApp basado en Baileys, inspirado en la estética de **Bocchi the Rock!**.

Esta distribución parte de una base con permiso de su autor original y fue adaptada con identidad, configuración y enlaces propios. No incluye sesiones, credenciales, claves ni metadatos criptográficos de terceros.

## Características

- Menús multimedia e interactivos.
- Reacciones anime.
- Descargas y búsquedas.
- Stickers y conversores.
- Economía y juegos.
- Administración de grupos.
- Sistema de subbots.
- Botones nativos seguros: selección, URL y copiar.

## Instalación

Requiere Node.js 22 o superior, FFmpeg y una cuenta de WhatsApp separada para el bot.

```bash
git clone https://github.com/riokuroxi-svg/BocchiTheRock-MD.git
cd BocchiTheRock-MD
cp .env.example .env
npm install
npm start
```

## Configuración

No guardes sesiones, tokens ni claves en Git. Configura las variables en `.env` o en tu entorno de ejecución. La sesión se almacena en `Sessions/`, que está excluida por `.gitignore`.

## Seguridad

Las funciones de pagos, catálogo comercial, ubicación, webviews y NSFW están desactivadas en esta distribución inicial. Las funciones que ejecutan comandos del sistema deben mantenerse restringidas al propietario y revisarse antes de habilitarlas.

## Licencia y atribución

Consulta `LICENSE`. Esta base conserva la atribución requerida por el proyecto de origen y añade la identidad de BocchiTheRock-MD. Las imágenes externas deben sustituirse por recursos propios o con licencia compatible antes de una distribución pública definitiva.
