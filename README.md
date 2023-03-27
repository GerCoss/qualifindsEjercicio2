# Instrucciones para ejecutar el Dockerfile

Estas son las instrucciones para ejecutar el programa para la extracción de productos a partir de una url del sitio https://super.walmart.com.mx/.

## Paso 1: Clonar el repositorio

Clonar el repositorio que contiene el Dockerfile:

```bash
git clone https://github.com/GerCoss/qualifindsEjercicio2.git
```

## Paso 2: Moverse al directorio del Dockerfile

Moverse al directorio donde se encuentra el Dockerfile:

```bash
cd <directorio del Dockerfile>
```

## Paso 3: Construir la imagen Docker

Construir la imagen Docker a partir del Dockerfile:

```bash
docker build -t <nombre de la imagen> .
```

## Paso 4: Ejecutar el contenedor Docker

Ejecutar el contenedor Docker con las variables de entorno configuradas para la URL y la clave API_Key, y montar un volumen de directorio compartido entre el contenedor y el host:

```bash
docker run -v <ruta local del host>:/app/output -e url=<URL> -e api_key=<API_Key> <nombre de la imagen>
```

Ejemplo:
```bash
docker run -v "$(pwd)":/app/output -e url=https://super.walmart.com.mx/content/bebidas-y-licores/licores/3680051_120099 -e api_key=3424l3425134 myscraper
```

Asegúrese de reemplazar `<URL>`, `<API_Key>`, `<ruta local del host>` y `<nombre de la imagen>` con los valores correspondientes en su caso.

<strong>Para obtener la `API key` necesaria para el funcionamiento del código, es necesario registrarse en el servicio de proxies llamado <a href="https://scrapeops.io/app/register/main" target="_blank">ScrapeOps</a>. Este servicio ofrece una solución para el manejo de proxies para scrapping web, y proporciona una `API key` que permite el acceso a sus proxies.</strong>


Una vez que se ejecuta el comando, el contenedor Docker se ejecutará y generará el archivo JSON correspondiente en la carpeta compartida del host.


