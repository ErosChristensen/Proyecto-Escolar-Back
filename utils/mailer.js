// ./utils/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
});

// -----------------------------
// 1️⃣ Enviar código de verificación
// -----------------------------
export async function enviarCodigoVerificacion(destinatario, codigo) {
  return transporter.sendMail({
    from: `"EESTN°1" <${process.env.MAIL_USER}>`,
    to: destinatario,
    subject: "Código de verificación EEST N1",
    html: `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fef3c7; padding:20px; font-family:Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:12px; padding:20px;">
              <tr>
                <td align="center">
                  <img src="cid:escudo" width="90" alt="Escudo Escuela" style="margin-bottom:12px; border-radius:8px;">
                  <h2 style="color:#ef6c00; margin:0 0 12px 0;">EEST Nº1</h2>
                  <p style="margin:0 0 12px 0;">Código de verificación</p>
                  <p style="font-size:24px; font-weight:bold; margin:12px 0;">${codigo}</p>
                  <p style="margin-top:16px;">Este código expirará en 5 minutos.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
    attachments: [
      {
        filename: 'EscudoEscuelaSinFondo.png',
        path: './public/uploads/EscudoEscuelaSinFondo.png',
        cid: 'escudo'
      }
    ]
  });
}

// -----------------------------
// 2️⃣ Enviar confirmación de formulario
// -----------------------------
export async function enviarConfirmacionFormulario(destinatario, alumno, dni, modalidad, respuestas) {
  const resumen = Object.entries(respuestas)
    .map(([pregunta, respuesta]) => {
      if (Array.isArray(respuesta)) {
        return `<li><b>${pregunta}:</b> ${respuesta.join(", ")}</li>`;
      } else {
        return `<li><b>${pregunta}:</b> ${respuesta}</li>`;
      }
    })
    .join("");

  return transporter.sendMail({
    from: `"EESTN°1" <${process.env.MAIL_USER}>`,
    to: destinatario,
    subject: "Confirmación de envío del formulario",
    html: `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:20px;">
        <tr>
          <td align="center">
            <table width="650" cellpadding="0" cellspacing="0" border="0" style="background-color:#d9d9d9; border-radius:12px; padding:0; font-family: Arial, sans-serif;">
              <tr>
                <!-- Columna izquierda con logo y nombre -->
                <td width="180" valign="top" style="background-color:#ef6c00; border-radius:12px 0 0 12px; padding:20px; color:#ffffff; text-align:center;">
                  <img src="cid:escudo" width="90" alt="Escudo Escuela" style="margin-bottom:12px; border-radius:8px;">
                  <h3 style="margin:0; font-size:18px;">EEST Nº1</h3>
                  <p style="margin:6px 0 0; font-size:14px;">Escuela de Educación Técnica</p>
                </td>

                <!-- Columna derecha con el contenido -->
                <td valign="top" style="padding:20px; color:#374151; font-size:15px; line-height:1.6;">
                  <h2 style="color:#1f2937; font-size:20px; margin-top:0; margin-bottom:12px;">Confirmación de Registro</h2>
                  <p>Hola <b>${alumno}</b>,</p>
                  <p>Recibimos tu formulario correctamente. Te compartimos el detalle. Si hay algún problema o error en tu información, comunicate de inmediato con los directivos de la escuela.</p>
                  <p><b>DNI:</b> ${dni}</p>
                  <p><b>Modalidad elegida:</b> ${modalidad}</p>
                  <p style="margin-top:16px; font-weight:bold;">Respuestas:</p>
                  <ul style="padding-left:20px; margin:0; color:#374151; font-size:15px;">
                    ${resumen}
                  </ul>
                  <p style="margin-top:24px; text-align:center;">
                    Gracias por tu participación.<br/>
                    <span style="color:#ef6c00; font-weight:bold;">EEST Nº1</span>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
    attachments: [
      {
        filename: 'EscudoEscuelaSinFondo.png',
        path: './public/uploads/EscudoEscuelaSinFondo.png',
        cid: 'escudo'
      }
    ]
  });
}
