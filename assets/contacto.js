const form = document.getElementById("contactoForm");
const respuesta = document.getElementById("respuesta");

if (form && respuesta) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    form.setAttribute("aria-busy", "true");
    respuesta.textContent = "Enviando...";

    const data = {
      nombre: form.nombre.value.trim(),
      email: form.email.value.trim(),
      mensaje: form.mensaje.value.trim(),
      privacidad: form.privacidad.checked ? "Aceptada" : "No aceptada",
      _subject: form.elements._subject.value,
    };

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        respuesta.textContent = "¡Gracias por tu mensaje! Te responderemos lo antes posible.";
        form.reset();
      } else {
        respuesta.textContent = "No se ha podido enviar el mensaje. Inténtalo de nuevo.";
      }
    } catch (error) {
      respuesta.textContent = "No se ha podido conectar. Inténtalo de nuevo más tarde.";
    } finally {
      submitButton.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
}
