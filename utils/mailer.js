import nodemailer from "nodemailer";

// Configuración del transportador SMTP (Gmail)
const transporter = nodemailer.createTransport({
host: "smtp.gmail.com",
port: 465,
secure: true,
auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
});

export async function enviarCodigoVerificacion(destinatario, codigo) {
return transporter.sendMail({
from: `"EESTN°1" <${process.env.MAIL_USER}>`,
to: destinatario,
subject: "Código de verificación EEST N1",
html: `       <div style="font-family:Arial,sans-serif; padding:20px; background:#f9fafb;">         <h2 style="color:#ef6c00;">EEST Nº1</h2>         <p>Tu código de verificación es:</p>         <p style="font-size:28px; font-weight:bold; color:#1f2937;">${codigo}</p>         <p>Este código expirará en 5 minutos.</p>       </div>
    `
});
}

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
html: `       <div style="font-family:Arial,sans-serif; padding:20px; background:#f9fafb;">         <h2 style="color:#ef6c00;">Confirmación de Registro</h2>         <p>Hola <b>${alumno}</b>,</p>         <p>Recibimos tu formulario correctamente.</p>         <p><b>DNI:</b> ${dni}</p>         <p><b>Modalidad elegida:</b> ${modalidad}</p>         <p><b>Respuestas:</b></p>         <ul>${resumen}</ul>         <p style="margin-top:20px;">Gracias por tu participación.<br/><b>EEST Nº1</b></p>       </div>
    `
});
}
