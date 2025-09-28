# ProyectoRagganelApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Prerequisites

*   Node.js and npm (LTS version recommended)
*   Angular CLI: `npm install -g @angular/cli`
*   MySQL
*   Visual Studio Code (Recommended)

## PowerShell Configuration (for Windows users)

To run scripts on Windows, you may need to set the execution policy. Open PowerShell as an administrator and run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## Project Setup

1.  **Clone the repository**

2.  **Database Setup**
    *   Create a MySQL database named `base_datos_inventario_taller`.
    *   Execute the SQL scripts located in the project to create the necessary tables and data.
    *   In the `backend` directory, copy the `backend/.env.example` file and rename the copy to `.env`. Then, fill in your database credentials in the new `.env` file.
        ```
        DB_HOST=localhost
        DB_USER=your_mysql_user
        DB_PASSWORD=your_mysql_password
        DB_DATABASE=base_datos_inventario_taller
        JWT_SECRET=your_jwt_secret_key
        ```

3.  **Install Dependencies**
    *   Install frontend dependencies from the project root:
        ```bash
        npm install
        ```
    *   Install backend dependencies:
        ```bash
        cd backend
        npm install
        cd ..
        ```

## Development server

This project consists of an Angular frontend and an Express backend. You need to run both servers.

1.  **Start the Backend Server:**
    In a terminal, run the following command from the project root:
    ```bash
    npm run start:dev
    ```
    This will start the Node.js server on `http://localhost:3000` (or as configured).

2.  **Start the Frontend Server:**
    In a *second* terminal, run the following command from the project root:
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Tecnologías Principales

Este proyecto está construido con las siguientes tecnologías y librerías principales. El comando `npm install` en las instrucciones de configuración instalará todas ellas automáticamente. Los siguientes comandos son solo de referencia para la instalación individual.

### Frontend (Angular)

*   **Angular**: Plataforma para construir aplicaciones web de escritorio y móviles.
*   **Angular Material**: Librería de componentes de UI para Angular. (`ng add @angular/material`)
*   **Bootstrap**: Para estilos y layout. (`npm install bootstrap`)
*   **ngx-charts**: Framework de gráficos para Angular. (`npm install @swimlane/ngx-charts`)
*   **jsPDF** & **jspdf-autotable**: Para generar documentos PDF. (`npm install jspdf jspdf-autotable`)
*   **SheetJS (xlsx)**: Para leer y escribir archivos de hojas de cálculo. (`npm install xlsx`)
*   **angularx-qrcode**: Para generar códigos QR. (`npm install angularx-qrcode`)

### Backend (Node.js)

*   **Node.js**: Entorno de ejecución de JavaScript.
*   **Express.js**: Framework de aplicación web para Node.js. (`npm install express`)
*   **MySQL2**: Cliente de MySQL para Node.js. (`npm install mysql2`)
*   **JSON Web Tokens (JWT)**: Para asegurar las APIs. (`npm install jsonwebtoken`)
*   **Bcrypt.js**: Para el hasheo de contraseñas. (`npm install bcryptjs`)
*   **CORS**: Middleware para habilitar el Intercambio de Recursos de Origen Cruzado. (`npm install cors`)
*   **Multer**: Middleware para manejar la subida de archivos (`multipart/form-data`). (`npm install multer`)
*   **Dotenv**: Para cargar variables de entorno desde un archivo `.env`. (`npm install dotenv`)
*   **Body-Parser**: Middleware para parsear los cuerpos de las solicitudes. (`npm install body-parser`)

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via Karma.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the Angular CLI Overview and Command Reference page.
