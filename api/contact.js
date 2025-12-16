import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, message: "Método no permitido" });

  const { nombre, email, mensaje } = req.body || {};
  if (!nombre || !email || !mensaje) return res.status(400).json({ ok: false, message: "Faltan datos" });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // contraseña de aplicación
    },
  });

  try {
    await transporter.sendMail({
      from: `"Web Forn Nou" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER, // a quién llega
      replyTo: email, // para responder al cliente
      subject: "Nuevo mensaje desde el formulario",
      text: `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Error enviando correo" });
  }
}
