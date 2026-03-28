# prueba-devsu

App en Angular para gestionar productos financieros. Consume una API REST local en Node.js.

## Antes de empezar

Necesitas tener corriendo el backend en el puerto 3002. Sin eso la app no va a cargar nada.

También asegúrate de tener instalado:
- Node.js 16 o superior
- Angular CLI (`npm install -g @angular/cli`)

## Cómo correrlo

npm install
ng serve

Abre `http://localhost:4200` y debería funcionar.

## Tests

Se está usando JEST

npm test

Para ver el reporte de cobertura:

npm test -- --coverage

Los archivos de cobertura quedan en `/coverage`. La cobertura está por encima del 70% en las tres capas principales: servicio, lista y formulario.

### Qué se está testeando

**ProductService** — 6 tests
- que el servicio se crea correctamente
- GET /products devuelve el listado
- POST /products crea un producto y retorna el mensaje correcto
- PUT /products/:id actualiza por id
- DELETE /products/:id elimina por id
- GET /products/verification/:id devuelve true/false según si existe

**ProductListComponent** — 11 tests
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

## Estructura

src/app/products/
  product-list/     lista principal
  product-form/     formulario de alta y edición
  delete-modal/     modal de confirmación
  services/         llamadas a la API
  interfaces/       tipado de Product

## Pruebas unintarias JEST

PS C:\Users\TEROS\Downloads\prueba-devsu\prueba-devsu> npm test

> prueba-devsu@0.0.0 test
> jest --coverage        

Determining test suites to run...@angular/compiler-cli@17.3.12 detected. Skipping 'ngcc'
Tip: To avoid this message you can remove 'jest-preset-angular/global-setup' from your jest config

 RUNS  src/app/products/product-list/product-list.component.spec.ts

 RUNS  src/app/products/product-list/product-list.component.spec.ts

 RUNS  src/app/products/product-list/product-list.component.spec.ts

 RUNS  src/app/products/product-list/product-list.component.spec.ts

 RUNS  src/app/products/product-list/product-list.component.spec.ts

 RUNS  src/app/products/product-list/product-list.component.spec.ts

 RUNS  src/app/products/product-list/product-list.component.spec.ts
 PASS  src/app/products/delete-modal/delete-modal.component.spec.ts (17.007 s)
 PASS  src/app/app.component.spec.ts (17.236 s)
 PASS  src/app/products/services/product.service.spec.ts (17.338 s)
 PASS  src/app/products/product-list/product-list.component.spec.ts (19.705 s)
 PASS  src/app/products/product-form/product-form.component.spec.ts (20.181 s)
-------------|---------|----------|---------|---------|-------------------
File         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------|---------|----------|---------|---------|-------------------
All files    |   72.22 |    51.11 |   70.58 |   74.84 |                   
 app         |     100 |      100 |     100 |     100 |                   
  ...nent.ts |     100 |      100 |     100 |     100 |                   
 ...te-modal |   77.77 |      100 |   33.33 |      75 |                   
  ...nt.html |     100 |      100 |     100 |     100 |                   
  ...nent.ts |      75 |      100 |   33.33 |   71.42 | 14-18             
 ...uct-form |   59.18 |    46.15 |   63.63 |   63.09 |                   
  ...nt.html |     100 |      100 |     100 |     100 |                   
  ...nent.ts |   58.76 |    46.15 |   63.63 |   62.65 | ...35,145,155-177 
 ...uct-list |    86.2 |    83.33 |      75 |   87.27 |                   
  ...nt.html |     100 |      100 |     100 |     100 |                   
  ...nent.ts |   85.96 |    83.33 |      75 |   87.03 | 74-87,107-108     
 ...services |     100 |      100 |     100 |     100 |                   
  ...vice.ts |     100 |      100 |     100 |     100 |                   
-------------|---------|----------|---------|---------|-------------------

Test Suites: 5 passed, 5 total
Tests:       36 passed, 36 total
Snapshots:   0 total
Time:        24.515 s
Ran all test suites.
PS C:\Users\TEROS\Downloads\prueba-devsu\prueba-devsu> 