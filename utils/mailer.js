// ./utils/mailer.js
import nodemailer from "nodemailer";

export async function enviarCodigoVerificacion(destinatario, codigo) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });

  const info = await transporter.sendMail({
    from: `"Soporte" <${process.env.MAIL_USER}>`,
    to: destinatario,
    subject: "Código para cambiar tu contraseña",
    text: `Tu código es: ${codigo}`,
    html: `<p>Tu código es: <b>${codigo}</b></p>`
  });

  return info;
}
