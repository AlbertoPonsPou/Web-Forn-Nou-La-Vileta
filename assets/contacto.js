const form = document.getElementById("contactoForm");
const respuesta = document.getElementById("respuesta");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  respuesta.textContent = "Enviando...";

  const data = {
    nombre: form.nombre.value,
    email: form.email.value,
    mensaje: form.mensaje.value,
  };

  try {
    const res = await fetch("https://formspree.io/f/xzdyrlpj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      respuesta.textContent = "Gracias por tu mensaje! Te responderemos lo antes posible.";
      form.reset();
    } else {
      respuesta.textContent = "❌ Error al enviar el mensaje";
    }
  } catch (error) {
    respuesta.textContent = "❌ Error de conexión";
  }
});