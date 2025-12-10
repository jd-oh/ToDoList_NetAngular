# To-Do List - Angular + .NET

Aplicación sencilla de tareas con Angular 21 para frontend y backend en .NET 9. Básicamente es un CRUD de tareas con autenticación JWT, un dashboard para ver estadísticas y manejo de estado con NgRx.

---

## Decisiones Técnicas


**Angular 21** - Quería probar la última versión con los nuevos signals y el control flow (@if, @for). También me gustó que los componentes standalone simplifican bastante el código.

**NgRx** - Para el estado global de las tareas. 

**Angular Material** - Empecé con CSS custom pero al final migré a Material porque los componentes ya vienen listos y el diseño queda más consistente.

**.NET 9 con Entity Framework** - El backend es bastante directo. Usé el patrón de servicios con interfaces para poder hacer mocking en los tests. La base de datos es SQL Server (localhost).

**JWT para auth** - Implementé login y registro con tokens JWT. El token se guarda en localStorage y hay un interceptor que lo agrega automáticamente a cada request.

### Estructura del código

En el frontend separé todo en carpetas:
- `core/` - servicios, guards, interceptors, modelos
- `features/` - cada pantalla en su carpeta (auth, dashboard, todos)
- `store/` - todo lo de NgRx (actions, reducer, effects, selectors)

En el backend:
- `Controllers/` - AuthController y TodosController
- `Services/` - la lógica de negocio
- `Models/` - entidades y DTOs separados

---

## Cómo ejecutar el proyecto

### Requisitos
- Node.js 18+
- .NET SDK 9.0
- SQL Server (local)

### Base de datos
Primero hay que crear la base de datos y las tablas. Ejecuta los scripts que están en la carpeta `Database/`:
1. `01_CrearTablas.sql` - crea la base de datos y las tablas Users y TodoItems
2. `02_DatosDePrueba.sql` - datos de prueba (opcional)

### Backend

```bash
cd ToDoListAPI
dotnet restore
dotnet run
```

Va a correr en http://localhost:5000. Puedes ver la documentación de la API en http://localhost:5000/swagger

### Frontend

```bash
cd ToDoListClient
npm install --legacy-peer-deps
npm start
```

Va a correr en http://localhost:4200

Nota: el `--legacy-peer-deps` es necesario porque algunos paquetes todavía no soportan oficialmente Angular 21.

---

## Cómo ejecutar las pruebas

### Tests del Backend

```bash
cd ToDoListAPI.Tests
dotnet test
```

Son 25 tests que cubren los servicios de autenticación y tareas.

### Tests del Frontend

```bash
cd ToDoListClient
npm test
```

Son 31 tests para los componentes principales y servicios.

Si quieres correr los tests una sola vez (sin watch):

```bash
npm test -- --run
```

---

## Credenciales de prueba

Si corriste el seed de la base de datos:
- Email: juandavidoh4@gmail.com
- Password: hola123

O simplemente registra un usuario nuevo desde la app.
