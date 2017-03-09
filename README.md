<!--Creado por Jonathan Carrero Aranda -->

**Saboteur**
==============
----------

Este proyecto consiste en el desarrollo de un portal web que permita a los usuarios jugar en línea a un juego de mesa llamado *Saboteur*. En este portal, un usuario/a podrá crear una cuenta de usuario, crear nuevas partidas, unirse a partidas ya creadas por otros y, obviamente, jugar en ellas.

## Competencias e implementación
---------------------------

Diseño de páginas web mediante HTML y CSS, además de una implementación en el servidor web utilizando *Node* y *Express.js*.
Al contrario que en el Planificador, no está permitido el uso de *Bootstrap* en el desarollo del juego.

## Resumen de la estructura del proyecto por carpetas
---------------------------

**controllers:** son los ficheros donde se lleva a cabo la recogida de peticiones que va realizando el usuario al servidor a medida que interactúa con la aplicación.

**helpers:** conjunto de métodos que ayudan a formar la vista y que, mayoritariamente, son comunes a gran parte del proyecto.

**integration:** aquí se almacenan los Data Access Object que recuperan e insertan información a la base de datos (pues se encuentran en la capa de integración).

**middlewares:** es la división en la que se basa *Express.js*. Un middleware es una función que recibe un objeto *request* con los datos de la petición del usuario y un objeto *response* con la respuesta acumulada hasta el momento. Durante la ejecución, un middleware puede leer/modificar ambos objetos.

**nbproject:** ficheros internos que usa *NetBeans* (IDE utilizado para el desarrollo de la aplicación).

**public:** aquí se encuentran los ficheros públicos del proyecto, es decir, aquellos recursos necesarios que son directamente expuestos ante el cliente. Algunos ficheros contenidos son: la página *index*, fuentes, el CSS de la aplicación, imágenes usadas, etc.

**views:** son los ficheros .ejs, los cuales mezclarán el modelo (datos) con la vista (HTML) para ser representados adecuadamente cuando estemos jugando.

El resto de ficheros contienen información acerca del proyecto (.json), la base de datos utilizada (.sql) o el punto de entrada en el flujo de ejecución de la aplicación (app.js).

## Guía básica de uso
---------------------------



