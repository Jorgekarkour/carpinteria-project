# 🛠️ Carpintería - Gestión de Proyectos

## 📌 Descripción
Esta aplicación está diseñada para gestionar proyectos de carpintería, permitiendo la administración de módulos en cada proyecto y generando el **despiece total** de materiales necesarios. La app facilita la gestión eficiente de proyectos, asegurando un cálculo preciso del material requerido para cada módulo.

## ✨ Características Principales
- 📂 **Gestión de Proyectos**: Crear, editar y eliminar proyectos.
- 📌 **Administración de Módulos**: Añadir, modificar y eliminar módulos dentro de un proyecto.
- 📊 **Cálculo Automático del Despiece**: Generación automática del despiece total de los módulos de un proyecto.
- 🎨 **Interfaz basada en Angular Material**: UI moderna y amigable.
- 🔍 **Búsqueda y Filtrado**: Filtros dinámicos para encontrar proyectos y módulos rápidamente.
- 📦 **Persistencia en LocalStorage**: Almacena los proyectos localmente para no depender de un backend.

---

## 🏛️ Arquitectura del Proyecto
- La aplicación está desarrollada con **Angular 19** utilizando **Standalone Components**, eliminando la necesidad de módulos tradicionales (`NgModule`).  
- Se ha estructurado en diferentes capas para garantizar **mantenibilidad, escalabilidad y reutilización de código**.  
- Se implementaron **componentes reutilizables** para mejorar la modularidad de la aplicación y evitar código duplicado.

---

## 🏗️ Tecnologías Utilizadas
- **⚡ Angular 19** con **Standalone Components**
- **🎨 Angular Material** para la interfaz
- **🛠️ Signals** para gestión de estado reactivo
- **📦 LocalStorage** para persistencia de datos
- **🔀 Angular Router** para navegación entre vistas
- **📝 RxJS** para manejo de eventos asíncronos

---
## 🔹 Componentes Reutilizables
- **`GridComponent`** 📊 → Tabla reutilizable con soporte para ordenación, paginación y filtrado.  
- **`ToolbarComponent`** 🏠 → Barra de navegación adaptable según la ruta.
- **`ConfirmationDialogComponent`** ⚠️ → Diálogo reutilizable para confirmar acciones (borrar, editar, etc.).  

## 🚀 Instalación y Ejecución
- npm install
- ng serve

## 📜 Uso de la Aplicación

- 1️⃣ Crear un Proyecto desde la lista de proyectos.
- 2️⃣ Agregar módulos dentro de un proyecto.
- 3️⃣ Configurar los módulos (Encimera o Estantería) y definir dimensiones.
- 4️⃣ Ver el despiece total del proyecto automáticamente generado.
- 5️⃣ Editar o eliminar módulos según sea necesario.
