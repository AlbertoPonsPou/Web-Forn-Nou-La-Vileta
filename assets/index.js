document.addEventListener("DOMContentLoaded", () => {
  const snowArea = document.getElementById("snow-area");
  if (!snowArea) return;

  const NUM_FLAKES = 120;

  for (let i = 0; i < NUM_FLAKES; i++) {
    // Contenedor lateral
    const wrapper = document.createElement("div");
    wrapper.classList.add("flake-container");

    // Copo que cae
    const flake = document.createElement("div");
    flake.classList.add("snowflake");
    flake.textContent = "❄";

    const size = 10 + Math.random() * 16;
    flake.style.fontSize = size + "px";

    wrapper.style.left = Math.random() * 100 + "vw";

    const fallDuration = 8 + Math.random() * 8;
    const swayDuration = 3 + Math.random() * 4;

    flake.style.animationDuration = `${fallDuration}s`;
    wrapper.style.animationDuration = `${swayDuration}s`;

    const delay = Math.random() * -20;
    flake.style.animationDelay = `${delay}s`;
    wrapper.style.animationDelay = `${delay}s`;

    wrapper.appendChild(flake);
    snowArea.appendChild(wrapper);
  }
});


window.cambiarImagen = function(imagen) {
  document.getElementById("imagenActiva").src = imagen.src;
};

window.mostrarTexto = function(seccion, event) {
  document.querySelectorAll('.texto-tab').forEach(el => el.classList.remove('activo'));
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('activa'));

  document.getElementById("texto-" + seccion).classList.add('activo');
  event.target.classList.add('activa');
};


document.addEventListener("DOMContentLoaded", () => {
  const fadeItems = document.querySelectorAll('.fade-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once only
      }
    });
  }, { threshold: 0.2 }); // triggers when 20% visible

  fadeItems.forEach(item => observer.observe(item));

  const elements = document.querySelectorAll(".fade-up");

  elements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("show");
    }, 300 + i * 250); // delay escalonado elegante
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".miniaturas");

  let isDown = false;
  let startX;
  let scrollLeft;

  contenedor.addEventListener("mousedown", (e) => {
    isDown = true;
    contenedor.classList.add("dragging");
    startX = e.pageX - contenedor.offsetLeft;
    scrollLeft = contenedor.scrollLeft;
  });

  contenedor.addEventListener("mouseleave", () => {
    isDown = false;
    contenedor.classList.remove("dragging");
  });

  contenedor.addEventListener("mouseup", () => {
    isDown = false;
    contenedor.classList.remove("dragging");
  });

  contenedor.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - contenedor.offsetLeft;
    const walk = (x - startX) * 2; // velocidad del drag
    contenedor.scrollLeft = scrollLeft - walk;
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactoForm");
  const respuesta = document.getElementById("respuesta");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nombre: form.nombre.value.trim(),
      email: form.email.value.trim(),
      mensaje: form.mensaje.value.trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.ok) {
        respuesta.textContent = "Mensaje enviado ✅";
        form.reset();
      } else {
        respuesta.textContent = "Contacto por correo todavia no dispoible❌";
      }
    } catch (err) {
      respuesta.textContent = "Error de conexión ❌";
    }
  });
});
const slides = document.querySelectorAll(".slidecarousel");
let current = 0;

setInterval(() => {
  slides[current].classList.remove("active");
  current = (current + 1) % slides.length;
  slides[current].classList.add("active");
}, 6000);
