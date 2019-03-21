# Gib Dummy Services V2
## Descripción

Aplicación que se encarga de levantar los servicios dummy para el GIB.
Esta aplicación tomá la descripción desde los archivos `.apib` para generar los servicios que en ellos se describen, montandolos en un servidor Express.
 La documentación de los servicios está visible en:   
https://luisegr.gitlab.io/gib-dummy-services/docs/

---

## Setup
### Instalación

Para instalar esta aplicación hay que ejecutar:
```bash
git clone https://gitlab.com/LuisEGR/gib-dummy-services.git
cd gib-dummy-services
npm install
```

### Ejecución

Para ejecutar esta aplicación hay que ejecutar:
```bash
npm start
```
---



## Creación de servicios nuevos

Para agregar un servicio nuevo hay que seguir estos sencillos pasos:

1. Crear el archivo del servicio `<nombre>.apib`
2. Crear las respuestas en archivos `.json`
3. Agegar el archivo `<nombre>.apib` en `index.apib`
4. Listo!

### Ejemplo de creación de servicio nuevo
A continuación se describe un ejemplo de un servicio sencillo:

    1. Crear el archivo del servicio `<nombre>.apib`

creamos el archivo `services/MyService/miService.apib`
en el contenido tiene lo siguiente:

```markdown
## My New Service [/ruta/to/myService]

### myService [GET]
    Retorna un objeto con una propiedad hola="mundo"

+ Response 200 (application/json)
<!-- include(myService.json) -->
+ Response 500 (application/json)
    {
        error: "fatal"
    }
```

Este se llama "My New Service" y se accede en la ruta `/ruta/to/myService`, solo tiene un método `GET` y tiene 2 respuestas posibles (200 y 500), la respuesta 200 se responde junto con el contenido del archivo `myService.json` y la respuesta 500 contiene el json de respuesta directo en ese archivo `myService.apib`



Ahora vamos a crear el archivo `services/MyService/myService.json` que es el que se utilizará para la respuesta 200:

```json
{
    "hola":"mundo"
}
```

Con esto ya tenemos listo nuestro servicio, solo es cuestión de ejecutar `npm start` y ya podemos hacer una petición HTTP GET a http://localhost:3050/ruta/to/myService y obtendremos el json de la primer respuesta que tenemos configurada (200).

### Notas
* Podemos agregar cualquier ruta pero hay que cuidar que no se repita en 2 servicios la misma.
* El método definido es el único que retornará una respuesta (GET, POST, PUT, DELETE, etc), si no está definido un método en un endpoint entonces el servicio retornará 404.
* Se pueden tener multiples respuestas aunque se repita el status, es decir, podemos tener 4 respuestas diferentes, todas con status 200, la respuesta que retornará el servicio se configura desde el objeto **config** dentro de `index.js`
* Si se quiere agregar lógica en un servicio, es decir, hacer algo dependiendo de los datos del request, entonces debemos crear un archivo con el mismo nombre del servicio (ej. `services/MyService/myService.js`), un ejemplo sobre esto se puede ver en: `services/direccion/`, en caso de que se tenga dicho archivo **.js** se ignorarán el resto de las respuestas configuradas en el archivo **.apib**
* Si el servicio tiene algo en el request body se debe definir, esto solo afectará a la documentación en caso de que no se agregue lógica al servicio con un **.js**, un ejemplo de un servicio con petición puede verse en: `services/validarCPV/validarCPV.apib`



## TO-DO

 * [ ] Crear una interfaz gráfica para configurar la respuesta por servicio en runtime.
 * [ ] Crear un script para generar un servicio y hacer este proceso más rápido.

---
Documentación creada con:
https://apiblueprint.org/documentation/


![Blueprint](https://www.plutora.com/wp-content/uploads/2018/07/api_blueprint.png "Api Blueprint")

