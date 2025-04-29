# SensaReal 🌡️

Este es un proyecto basado en Vue.js que utiliza Vite como herramienta de construcción. A continuación, se detallan las instrucciones para configurar y ejecutar el proyecto.

## 📋 Requisitos Previos

Asegúrate de tener instalados los siguientes programas:

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)
- Navegador web moderno
- Editor de código recomendado: VSCode

## 🛠️ Tecnologías Principales

- Vue.js 3
- TypeScript
- Vite
- Chart.js
- Pinia (manejo de estado)
- Font Awesome (iconos)

## ⚙️ Instalación

1. Clona este repositorio en tu máquina local.
2. Navega al directorio del proyecto.
3. Ejecuta el siguiente comando para instalar las dependencias:

   ```bash
   npm install
   ```

## 🚀 Comandos Disponibles

```sh
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar versión de producción
npm run preview

# Verificar tipos de TypeScript
npm run type-check

# Formatear código
npm run format
```

## 📁 Estructura del Proyecto

```
sensareal/
├── src/
│   ├── assets/         # Recursos estáticos
│   ├── components/     # Componentes Vue
│   ├── router/         # Configuración de rutas
│   ├── stores/         # Stores de Pinia
│   ├── views/          # Vistas/páginas
│   └── App.vue         # Componente raíz
├── public/             # Archivos públicos
└── package.json        # Dependencias y scripts
```

## 🔧 Configuración del IDE

### VSCode

Extensiones recomendadas:
- Vue.volar (Volar) - Deshabilitar Vetur si está instalado
- esbenp.prettier-vscode

La configuración del editor ya está incluida en `.vscode/settings.json`.

### Soporte de TypeScript para Importaciones `.vue`

TypeScript no puede manejar la información de tipos para las importaciones `.vue` por defecto, por lo que reemplazamos el CLI `tsc` con `vue-tsc` para la verificación de tipos. En los editores, necesitamos [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para que el servicio de lenguaje TypeScript reconozca los tipos `.vue`.

## 📝 Convenciones de Código

### Nombrado
- Componentes: PascalCase (ej: `TheHeader.vue`)
- Archivos de utilidad: camelCase (ej: `useAuth.ts`)
- Constantes: UPPER_SNAKE_CASE
- Variables y funciones: camelCase

### Estilos
- Usar CSS con scope en componentes Vue
- Variables CSS definidas en `assets/base.css`
- Seguir la guía de estilos de Vue.js

### TypeScript
- Usar tipos explícitos
- Evitar `any`
- Interfaces para objetos complejos

### Git
- Formato: `tipo: descripción corta`
- Tipos: feat, fix, docs, style, refactor, test, chore

## ⚙️ Configuración Personalizada

Para configuración adicional, consulta la [Referencia de Configuración de Vite](https://vite.dev/config/).

## 🔐 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=tu_url_api
```



## 👥 Contribución


