import nodemailer from "nodemailer";

export async function enviarCodigoVerificacion(destinatario, codigo) {
  // Configura tu cuenta de correo (puedes usar Gmail, Outlook, etc.)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER, // Tu correo
      pass: process.env.MAIL_PASS, // Tu contraseña o app password
    },
  });

  const mailOptions = {
    from: `"Proyecto Escolar" <${process.env.MAIL_USER}>`,
    to: destinatario,
    subject: "Código de verificación para cambio de contraseña",
    text: `Tu código de verificación es: ${codigo}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error enviando email:", error);
    throw error;
  }
}