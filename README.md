# 🤝 La feria - Back-end

➡️ Este es un proyecto realizado con Node.js y Express.js, que busca generar los servicios de una API RESTful para gestionar
una aplicación de "market place" que simula ser una "Feria de las pulgas online". Este proyecto, además de las tecnologías
ya mencionadas, usa otras librerías importantes de mencionar, por ejemplo, el paquete ```pg``` que permite la conexión con la base de datos y también
el paquete ```jsonwebtonken``` que por su parte permite crear, firmar y validar tokens de autenticación.

ℹ️ Además es importante decir también que este proyecto es parte de un desafío de programación que queda especificado
en el siguiente archivo PDF [Hito 3 - PDF](01-hito-3-desarrollo-backend.pdf)

## ✅ Requerimientos
- Node.js versión 18.0.0 o superior.
- PostgreSQL versión 13.0 o superior.
- npm versión 7.0.0 o superior.
- Git versión 2.33.0 o superior.
- Un editor de código, por ejemplo, Visual Studio Code.
- Postman para probar las rutas de la API o cualquier otro cliente para simular peticiones HTTP.

## 👨‍💻 Instalación
Para instalar este proyecto, primero se debe clonar el repositorio en la máquina local, luego se debe instalar las dependencias y
por último ejecutar algún comando en específico para ejecutar el proyecto. A continuación un paso a pas:

1. Clonar el repositorio:
```bash
git clone https://github.com/felipejoq/la-feria-backend.git
```

2. Ingresar al directorio del proyecto:
```bash
cd la-feria-backend
```

3. _IMPORTANTE:_ Crear un archivo ```.env``` tomando como ejemplo el archivo ```.env.template``` que se encuentra en la raíz del proyecto.

4. Instalar las dependencias:
```bash
npm install
```

5. Ejecutar el proyecto en local
```bash
npm run dev
```

6. Ejecutar los tests unitarios
```bash
npm run test
```