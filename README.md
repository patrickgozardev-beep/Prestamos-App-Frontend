# 🏦 Gozar Capital - Sistema de Gestión de Préstamos
Gozar Capital es una aplicación fintech de última generación diseñada para la gestión eficiente de préstamos personales. El sistema permite el registro de clientes, la creación de cronogramas de pago (diarios/semanales) y el seguimiento de cuotas en tiempo real, todo bajo una interfaz premium inspirada en los estándares bancarios.

## 🚀 Tecnologías y Versiones
Este frontend ha sido construido con las herramientas más modernas del ecosistema web para garantizar velocidad y escalabilidad:

React 18: Biblioteca principal para la construcción de interfaces de usuario.

TypeScript: Tipado estático para un código robusto y libre de errores de ejecución.

Vite 6: Tooling de última generación para un desarrollo ultra rápido y compilaciones optimizadas.

Chakra UI: Framework de componentes utilizado para la estructura base.

Phosphor Icons: Librería de iconos minimalistas para el look & feel financiero.

React Router Dom: Gestión de navegación y parámetros de ruta.

## 🎨 Características de Diseño (UI/UX)
El proyecto destaca por una personalización profunda de componentes para evitar el "look genérico":

Custom Selects: Componentes de selección desarrollados desde cero para eliminar los menús nativos del navegador y el "focus" azul por defecto.

Estilo Bancario: Implementación de colores institucionales (#004481) y tipografías con alta jerarquía visual.

Mobile First: Optimizado específicamente para dispositivos móviles como el Redmi Note 14, garantizando que los inputs y botones sean fáciles de accionar.

## 🛠️ Lógica de Préstamos
El sistema maneja flujos complejos de datos financieros:

Cálculo Dinámico: Generación de montos totales e intereses en tiempo real antes de confirmar el préstamo.

Frecuencias Flexibles: Soporte para cobros diarios (ej. 24 cuotas) y semanales, con automatización de fechas de inicio.

Resumen de Cuotas: Cálculo preciso de la cuota fija mediante lógica de intereses personalizada.

## 💻 Configuración de Desarrollo
Instalación
Bash
npm install
Ejecución en modo desarrollo
Bash
npm run dev
Construcción para producción
Bash
npm run build
⚙️ Calidad de Código y Linting
Para mantener un estándar de producción, hemos configurado ESLint con reglas estrictas de TypeScript:

tseslint.configs.recommendedTypeChecked: Garantiza que los tipos sean consistentes en toda la app.

eslint-plugin-react-x: Reglas específicas para el uso óptimo de hooks y componentes React.
