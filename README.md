# prueba-devsu

App en Angular para gestionar productos financieros. Consume una API REST local en Node.js.

## Antes de empezar

Necesitas tener corriendo el backend en el puerto 3002. Sin eso la app no va a cargar nada.

También asegúrate de tener instalado:
- Node.js 16 o superior
- Angular CLI (`npm install -g @angular/cli`)

## Cómo correrlo

```bash
npm install
ng serve
```

Abre `http://localhost:4200` y debería funcionar.

## Tests

Se está usando Jest en lugar de Karma.

```bash
npm test
```

Para ver el reporte de cobertura:

```bash
npm test -- --coverage
```

Los archivos de cobertura quedan en `/coverage`.

### Qué se está testeando

**ProductService** — 6 tests
- que el servicio se crea correctamente
- GET /products devuelve el listado
- POST /products crea un producto y retorna el mensaje correcto
- PUT /products/:id actualiza por id
- DELETE /products/:id elimina por id
- GET /products/verification/:id devuelve true/false según si existe

**ProductListComponent** — 12 tests
- renderiza el componente
- carga los productos al iniciar
- la paginación respeta el pageSize seleccionado
- el buscador filtra por texto correctamente
- limpiar el buscador devuelve todos los resultados
- sin coincidencias muestra estado vacío
- el menú contextual abre y cierra por toggle
- closeMenus() cierra todos los menús
- onDeleteRequest() abre el modal con el producto correcto
- confirmar eliminación llama al servicio y recarga
- cancelar cierra el modal sin eliminar
- muestra mensaje de error si la carga falla

**ProductFormComponent** — 13 tests
- renderiza el componente
- el formulario inicia inválido
- valida minLength(3) en el campo id
- valida maxLength(10) en el campo id
- valida minLength(5) en name
- valida minLength(10) en description
- date_release no puede ser una fecha pasada
- date_release acepta la fecha de hoy
- date_revision debe ser exactamente un año después de date_release
- date_revision correcta no muestra error
- no llama a create() si el formulario es inválido
- getError() retorna el mensaje correcto para campo requerido vacío
- isInvalid() retorna true/false según el estado del control
- onReset() limpia el formulario

**DeleteModalComponent** — 3 tests
- renderiza el componente
- emite evento confirm al confirmar
- emite evento cancel al cancelar

**AppComponent** — 2 tests
- renderiza el componente
- contiene el router-outlet

### Resultados
------------------------------|---------|----------|---------|---------|--------------------------------------
File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------------|---------|----------|---------|---------|--------------------------------------
All files                     |   72.22 |    51.11 |   70.58 |   74.84 |                                      
 app                          |     100 |      100 |     100 |     100 |                                      
  app.component.ts            |     100 |      100 |     100 |     100 |                                      
 app/products/delete-modal    |   77.77 |      100 |   33.33 |      75 |                                      
  delete-modal.component.html |     100 |      100 |     100 |     100 |                                      
  delete-modal.component.ts   |      75 |      100 |   33.33 |   71.42 | 14-18                                
 app/products/product-form    |   59.18 |    46.15 |   63.63 |   63.09 | 
  product-form.component.html |     100 |      100 |     100 |     100 | 
  product-form.component.ts   |   58.76 |    46.15 |   63.63 |   62.65 | 57-65,99,111-117,130-135,145,155-177
 app/products/product-list    |    86.2 |    83.33 |      75 |   87.27 | 
  product-list.component.html |     100 |      100 |     100 |     100 | 
  product-list.component.ts   |   85.96 |    83.33 |      75 |   87.03 | 74-87,107-108
 app/products/services        |     100 |      100 |     100 |     100 | 
  product.service.ts          |     100 |      100 |     100 |     100 | 
------------------------------|---------|----------|---------|---------|--------------------------------------

Test Suites: 5 passed, 5 total
Tests:       36 passed, 36 total

## Estructura

```
src/app/products/
  product-list/     lista principal
  product-form/     formulario de alta y edición
  delete-modal/     modal de confirmación
  services/         llamadas a la API
  interfaces/       tipado de Product
```

## Endpoints que consume

La base es `http://localhost:3002/bp`

| Método | Ruta | Para qué |
|--------|------|----------|
| GET | /products | traer todos |
| POST | /products | crear |
| PUT | /products/:id | editar |
| DELETE | /products/:id | eliminar |
| GET | /products/verification/:id | validar que el ID no exista |
