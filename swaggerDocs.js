// swaggerDocs.js
import swaggerUi from "swagger-ui-express";  // UI de Swagger (interfaz web)
import swaggerJSDoc from "swagger-jsdoc";   // Genera la doc a partir de comentarios

/*
  =============================
  CONFIGURACIÓN PRINCIPAL
  =============================
  - openapi: versión de especificación (usamos 3.0.0)
  - info: metadatos de tu API
  - servers: servidores donde vive la API
  - apis: archivos donde swagger-jsdoc buscará los bloques de documentación
*/
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API del Sitio Institucional", // nombre que aparece en Swagger UI
      version: "1.0.0",                     // versión de tu API
      description: "Documentación de la API (noticias, login, etc.) con Swagger"
    },
    servers: [
      {
        url: "http://localhost:3000",   // prefijo base de tu backend
        description: "Servidor local"
      }
    ]
  },
  apis: ["./swaggerDocs.js"],  // donde buscar los comentarios @swagger
};

/*
  =============================
  INICIALIZAR SWAGGER
  =============================
  - swaggerSpec: genera la especificación a partir de "options"
*/
const swaggerSpec = swaggerJSDoc(options);

/**
 * @swagger
 * tags:
 *   - name: Formulario
 *     description: Elección de modalidad y validación por código
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Enviar formulario de elección de modalidad
 *     tags: [Formulario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dni
 *               - alumno
 *               - mail
 *               - respuestas_formulario
 *               - modalidad_elegida
 *             properties:
 *               dni:
 *                 type: string
 *               alumno:
 *                 type: string
 *               mail:
 *                 type: string
 *                 format: email
 *               respuestas_formulario:
 *                 type: object
 *                 description: Respuestas del alumno al formulario
 *               modalidad_elegida:
 *                 type: string
 *     responses:
 *       200:
 *         description: Formulario enviado y confirmado por mail
 *       400:
 *         description: Ya se envió el formulario o faltan datos
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /pedir-codigo:
 *   post:
 *     summary: Solicitar código de verificación por mail
 *     tags: [Formulario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dni
 *               - mail
 *             properties:
 *               dni:
 *                 type: string
 *               mail:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Código enviado al mail
 *       400:
 *         description: Falta DNI o mail
 *       500:
 *         description: No se pudo enviar el correo
 */

/**
 * @swagger
 * /validar-codigo:
 *   post:
 *     summary: Validar código de verificación
 *     tags: [Formulario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dni
 *               - codigo
 *             properties:
 *               dni:
 *                 type: string
 *               codigo:
 *                 type: string
 *                 description: Código de 6 dígitos enviado al mail
 *     responses:
 *       200:
 *         description: Código válido, puede completar el formulario
 *       400:
 *         description: Código incorrecto, expirado o faltan datos
 */

/**
 * @swagger
 * tags:
 *   - name: Admin Noticias
 *     description: Endpoints de administración para gestionar noticias con imágenes
 */

/**
 * @swagger
 * /admin/noticias:
 *   post:
 *     summary: Crear una noticia (con imágenes opcionales)
 *     tags: [Admin Noticias]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *             properties:
 *               titulo:
 *                 type: string
 *               subtitulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Hasta 3 imágenes
 *     responses:
 *       201:
 *         description: Noticia creada correctamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /admin/noticias/{id}:
 *   put:
 *     summary: Actualizar una noticia existente
 *     tags: [Admin Noticias]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la noticia
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               subtitulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Hasta 3 imágenes nuevas (reemplazan a las anteriores)
 *     responses:
 *       200:
 *         description: Noticia actualizada correctamente
 *       400:
 *         description: No se enviaron campos para actualizar
 *       404:
 *         description: Noticia no encontrada
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /admin/noticias/{id}:
 *   delete:
 *     summary: Eliminar una noticia
 *     tags: [Admin Noticias]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la noticia
 *     responses:
 *       200:
 *         description: Noticia eliminada correctamente
 *       404:
 *         description: Noticia no encontrada
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * tags:
 *   name: Noticias
 *   description: Endpoints para gestionar noticias
 */

/**
 * @swagger
 * /noticias:
 *   get:
 *     summary: Obtener todas las noticias
 *     tags: [Noticias]
 *     responses:
 *       200:
 *         description: Lista de noticias
 */

/**
 * @swagger
 * /noticias/{id}:
 *   get:
 *     summary: Obtener una noticia por ID
 *     tags: [Noticias]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la noticia
 *     responses:
 *       200:
 *         description: Noticia encontrada
 *       404:
 *         description: No encontrada
 */

/**
 * @swagger
 * /noticias:
 *   post:
 *     summary: Crear una nueva noticia
 *     tags: [Noticias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *               - fecha
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *               imagen1:
 *                 type: string
 *               imagen2:
 *                 type: string
 *               imagen3:
 *                 type: string
 *     responses:
 *       201:
 *         description: Noticia creada
 */

/**
 * @swagger
 * /noticias/{id}:
 *   put:
 *     summary: Actualizar una noticia por ID
 *     tags: [Noticias]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *               imagen1:
 *                 type: string
 *               imagen2:
 *                 type: string
 *               imagen3:
 *                 type: string
 *     responses:
 *       200:
 *         description: Noticia actualizada
 *       404:
 *         description: Noticia no encontrada
 */

/**
 * @swagger
 * /noticias/{id}:
 *   delete:
 *     summary: Eliminar una noticia por ID
 *     tags: [Noticias]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Noticia eliminada
 *       404:
 *         description: No encontrada
 */


/*

/**
 * @swagger
 * tags:
 *   name: Login
 *   description: Autenticación de administradores
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - contraseña
 *             properties:
 *               usuario:
 *                 type: string
 *                 format: email
 *               contraseña:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Login correcto, devuelve token JWT
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Usuario o contraseña incorrectos
 *       403:
 *         description: Cuenta deshabilitada
 */
/**
 * @swagger
 * tags:
 *   - name: Modificaciones de Historia
 *     description: Endpoints para modificar la sección Historia
 *   - name: Modificaciones de Inicio
 *     description: Endpoints para modificar la sección Inicio
 *   - name: Modificaciones de Modalidades
 *     description: Endpoints para modificar la sección Modalidades
 */

/**
 * @swagger
 * /historia:
 *   get:
 *     summary: Obtener contenido de Historia
 *     tags: [Modificaciones de Historia]
 *     responses:
 *       200:
 *         description: JSON completo de historia.json
 *   put:
 *     summary: Reemplazar contenido completo de Historia
 *     tags: [Modificaciones de Historia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Historia reemplazada con éxito
 */

/**
 * @swagger
 * /historia/{campo}:
 *   patch:
 *     summary: Actualizar un campo plano de Historia
 *     tags: [Modificaciones de Historia]
 *     parameters:
 *       - in: path
 *         name: campo
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del campo que se quiere actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Campo actualizado
 */

/**
 * @swagger
 * /historia/autoridades/{index}:
 *   put:
 *     summary: Editar una autoridad en Historia
 *     tags: [Modificaciones de Historia]
 *     parameters:
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *         description: Índice de la autoridad en el array
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Autoridad actualizada
 */

/**
 * @swagger
 * /historia/talleres/{index}:
 *   put:
 *     summary: Editar un taller en Historia
 *     tags: [Modificaciones de Historia]
 *     parameters:
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Taller actualizado
 */

/**
 * @swagger
 * /inicio:
 *   get:
 *     summary: Obtener contenido de Inicio
 *     tags: [Modificaciones de Inicio]
 *     responses:
 *       200:
 *         description: JSON completo de inicio.json
 *   put:
 *     summary: Reemplazar contenido completo de Inicio
 *     tags: [Modificaciones de Inicio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Inicio reemplazado
 */

/**
 * @swagger
 * /inicio/{campo}:
 *   patch:
 *     summary: Actualizar un campo en Inicio
 *     tags: [Modificaciones de Inicio]
 *     parameters:
 *       - in: path
 *         name: campo
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Campo actualizado
 */

/**
 * @swagger
 * /inicio/preguntas_frecuentes/{index}:
 *   put:
 *     summary: Editar una pregunta frecuente
 *     tags: [Modificaciones de Inicio]
 *     parameters:
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Pregunta frecuente actualizada
 */

/**
 * @swagger
 * /modalidades:
 *   get:
 *     summary: Obtener contenido de Modalidades
 *     tags: [Modificaciones de Modalidades]
 *     responses:
 *       200:
 *         description: JSON completo de modalidades.json
 *   put:
 *     summary: Reemplazar contenido completo de Modalidades
 *     tags: [Modificaciones de Modalidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Modalidades reemplazadas
 */

/**
 * @swagger
 * /modalidades/{campo}:
 *   patch:
 *     summary: Actualizar un campo en Modalidades
 *     tags: [Modificaciones de Modalidades]
 *     parameters:
 *       - in: path
 *         name: campo
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Campo actualizado
 */

/**
 * @swagger
 * /modalidades/modalidad_1/{index}:
 *   put:
 *     summary: Editar un item en modalidad_1
 *     tags: [Modificaciones de Modalidades]
 *     parameters:
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Ítem actualizado
 */

/**
 * @swagger
 * /modalidades/modalidad_2/{index}:
 *   put:
 *     summary: Editar un item en modalidad_2
 *     tags: [Modificaciones de Modalidades]
 *     parameters:
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Ítem actualizado
 */

export { swaggerUi, swaggerSpec };
