# Nominapp

Nominapp es una aplicación de escritorio y web para la gestión de nómina, diseñada para manejar una base de datos de trabajadores y enviar automáticamente sus desprendibles de pago. La aplicación está construida con **React.js**, **Next.js** y **Electron**, lo que permite ejecutarla tanto como aplicación de escritorio (offline/standalone) como en entorno web.

## Descripción

Con Nominapp puedes administrar empleados, generar desprendibles de sueldo, gestionar devengados y deducciones, y enviar comprobantes automáticamente por correo electrónico. El backend local usa **Express** y **SQLite** embebido, facilitando la operación autónoma sin necesidad de servidores externos.

## Características principales

- Aplicación híbrida: funciona como app de escritorio (Electron) y web (Next.js).
- Gestión de base de datos de trabajadores y colaboradores.
- Generación automática de desprendibles de pago en PDF y Excel.
- Envío de desprendibles y comprobantes por correo electrónico integrado.
- Panel administrativo intuitivo.
- Almacenamiento local con SQLite para operación offline.
- APIs internas para devengados, deducciones, historial, generación de Excel/PDF y envío de emails.
- Compatible con adjuntos y generación de reportes históricos.

## Tecnologías utilizadas

- **Frontend**: React.js, Next.js, CSS
- **Escritorio/Backend local**: Electron, Express, SQLite (better-sqlite3)
- **Otras**: Node.js, Resend (email), ExcelJS, ilovepdf-nodejs

## Estructura del Proyecto

```
electron/
  ├─ main.js         # Inicialización de Electron y Express
  ├─ server.js       # Servidor Express backend local
  ├─ api/            # Rutas API (devengados, deducciones, historial, email, Excel, etc.)
  ├─ db/             # Configuración y migraciones de la base de datos SQLite
  └─ preload.js      # Preload para integración con Electron
src/
  └─ app/            # Frontend React/Next.js (UI, páginas, hooks)
```

## Instalación y Ejecución

1. **Descargar o clonar el repositorio:**
   ```bash
   git clone https://github.com/LilMasaX/Nominapp-react.js-next.js.git
   cd Nominapp-react.js-next.js
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Modo Escritorio (Electron):**
   ```bash
   npm run electron
   ```
   Esto inicia el backend local y la interfaz en una ventana de escritorio.

4. **Modo Web (desarrollo):**
   ```bash
   npm run dev
   ```
   Accede a la app en [http://localhost:3000](http://localhost:3000).

## Contribuciones

¡Contribuciones y reportes de bugs son bienvenidos! Haz un fork del repositorio, genera un pull request o abre un issue para sugerencias o problemas.

## Licencia

Este proyecto está bajo la licencia MIT.

---

Desarrollado por [LilMasaX](https://github.com/LilMasaX)
