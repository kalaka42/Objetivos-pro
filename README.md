# Objetivos Pro

App web instalable para iPhone con diseño oscuro, objetivos, contador +1/-1, filtros y progreso guardado localmente.

## Cómo probarla
Los archivos de una PWA deben servirse desde HTTPS o localhost para que la instalación y el modo sin conexión funcionen. No abras `index.html` directamente para probar el service worker.

## Publicarla gratis con GitHub Pages
1. En una computadora, entra a https://github.com y crea una cuenta si no tienes.
2. Crea un repositorio nuevo, por ejemplo `objetivos-pro`.
3. Sube todos los archivos de esta carpeta a la raíz del repositorio.
4. En el repositorio, abre **Settings → Pages**.
5. En “Build and deployment”, elige **Deploy from a branch**, selecciona `main` y la carpeta `/ (root)`, y guarda.
6. Espera a que GitHub Pages publique tu web. Copia la URL que te dé.

## Instalar en iPhone
1. Abre la URL publicada en **Safari**.
2. Pulsa **Compartir** (cuadrado con flecha hacia arriba).
3. Toca **Añadir a pantalla de inicio**. Si aparece, activa la opción para abrir como app web.
4. Pulsa **Añadir**.

## Qué incluye
- Crear y eliminar objetivos.
- Sumar y restar progreso.
- Barras de avance y resumen global.
- Filtros: todos, pendientes y logrados.
- Guardado en el almacenamiento local del navegador.
- Base de funcionamiento offline con service worker.

## Importante
El progreso se guarda en ese dispositivo/navegador. Borrar los datos de Safari puede borrarlo. Esta versión no sincroniza entre dispositivos y no tiene cuentas ni copias de seguridad en la nube.
