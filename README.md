# SensaReal 🌡️

Sistema de monitoreo de temperatura y humedad en tiempo real utilizando sensores DHT22.

## 📋 Requisitos Previos

- Node.js (v22.0.0 o superior)
- npm (incluido con Node.js)
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

1. Clonar el repositorio:
```sh
git clone https://github.com/tu-usuario/sensareal.git
cd sensareal
```

2. Instalar dependencias:
```sh
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
- Commits en español
- Formato: `tipo: descripción corta`
- Tipos: feat, fix, docs, style, refactor, test, chore

## ⚙️ Configuración Personalizada

Para configuración adicional, consulta la [Referencia de Configuración de Vite](https://vite.dev/config/).

## 🔐 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=tu_url_api
```

## 📄 Licencia

MIT

## 👥 Contribución

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
