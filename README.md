# Click the Box – Prueba de Reacción

Un juego de prueba de reacción desarrollado con React + Vite + TypeScript.

## 🎮 Cómo jugar

1. Selecciona un nivel de dificultad (1-4)
2. Haz clic en "Empezar"
3. Espera a que aparezcan los cuadros
4. Haz clic en el cuadro **verde** (el correcto)
5. Evita hacer clic en los cuadros **rojos** (incorrectos)

## 📊 Características

- 4 niveles de dificultad (2, 3, 4 o 5 cuadros simultáneos)
- Registro de tiempos de reacción
- Estadísticas: último tiempo, promedio y mejor tiempo
- Diseño responsive y moderno

## 🚀 Instalación y desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build
npm run preview
```

## 📦 Tecnologías

- React 18
- Vite
- TypeScript
- CSS3

## 🌐 Deploy en GitHub Pages

Este proyecto está configurado para deploy automático en GitHub Pages usando GitHub Actions.

### Configuración

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: selecciona "GitHub Actions"
4. El workflow se ejecutará automáticamente en cada push a `main`

### Ajustar la ruta base

Si tu repositorio tiene un nombre diferente a "juego", edita `vite.config.ts` y cambia la ruta base:

```typescript
base: process.env.NODE_ENV === 'production' ? '/TU_NOMBRE_REPO/' : '/',
```

Si tu repositorio es `usuario.github.io`, usa `'/'` como base.

## 📝 Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.

