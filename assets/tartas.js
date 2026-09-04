document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    const mobileNavigation = window.matchMedia("(max-width: 1200px)");

    const setMenuState = (isOpen) => {
      const expanded = mobileNavigation.matches && isOpen;
      navLinks.classList.toggle("active", expanded);
      hamburger.setAttribute("aria-expanded", String(expanded));
      hamburger.setAttribute("aria-label", expanded ? "Cerrar menú" : "Abrir menú");

      if (mobileNavigation.matches) {
        navLinks.toggleAttribute("inert", !expanded);
        navLinks.setAttribute("aria-hidden", String(!expanded));
      } else {
        navLinks.removeAttribute("inert");
        navLinks.removeAttribute("aria-hidden");
      }
    };

    const closeMenu = () => {
      setMenuState(false);
    };

    hamburger.addEventListener("click", () => {
      setMenuState(hamburger.getAttribute("aria-expanded") !== "true");
    });

    navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinks.classList.contains("active")) {
        closeMenu();
        hamburger.focus();
      }
    });

    mobileNavigation.addEventListener("change", closeMenu);
    closeMenu();
  }

  const images = document.querySelectorAll(".masonry-item img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");
  const nextBtn = document.querySelector(".lightbox-next");
  const prevBtn = document.querySelector(".lightbox-prev");

  if (!images.length || !lightbox || !lightboxImg || !closeBtn || !nextBtn || !prevBtn) return;

  let currentIndex = 0;
  let lastFocusedImage = null;
  const imgArray = Array.from(images);
  const backgroundElements = document.querySelectorAll("body > header, body > main, body > footer");

  function openLightbox(index) {
    currentIndex = index;
    lastFocusedImage = imgArray[currentIndex];
    lightboxImg.src = imgArray[currentIndex].src;
    lightboxImg.alt = imgArray[currentIndex].alt;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    lightbox.removeAttribute("inert");
    document.body.classList.add("lightbox-open");
    backgroundElements.forEach((element) => element.setAttribute("inert", ""));
    [closeBtn, prevBtn, nextBtn].forEach((button) => button.removeAttribute("tabindex"));
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.setAttribute("inert", "");
    document.body.classList.remove("lightbox-open");
    backgroundElements.forEach((element) => element.removeAttribute("inert"));
    [closeBtn, prevBtn, nextBtn].forEach((button) => button.setAttribute("tabindex", "-1"));
    lastFocusedImage?.focus();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imgArray.length;
    lightboxImg.src = imgArray[currentIndex].src;
    lightboxImg.alt = imgArray[currentIndex].alt;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imgArray.length) % imgArray.length;
    lightboxImg.src = imgArray[currentIndex].src;
    lightboxImg.alt = imgArray[currentIndex].alt;
  }

  images.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "Tab") {
      const controls = [closeBtn, prevBtn, nextBtn];
      const currentControl = controls.indexOf(document.activeElement);
      const direction = e.shiftKey ? -1 : 1;
      const nextControl = (currentControl + direction + controls.length) % controls.length;
      e.preventDefault();
      controls[nextControl].focus();
    }
  });
  const items = document.querySelectorAll(".masonry-item");

  if ("IntersectionObserver" in window) {
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), index * 80);
          galleryObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach((item) => galleryObserver.observe(item));
  } else {
    items.forEach((item) => item.classList.add("visible"));
  }

  const elements = Array.from(document.querySelectorAll(".fade-up"));
  const reduceFadeMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  elements.forEach((element, index) => {
    element.style.transitionDelay = reduceFadeMotion ? "0ms" : `${index * 250}ms`;
    element.addEventListener("transitionend", () => {
      element.style.transitionDelay = "0ms";
    }, { once: true });
  });
  window.setTimeout(() => {
    elements.forEach((element) => element.classList.add("show"));
  }, 300);
  window.setTimeout(() => {
    elements.forEach((element) => {
      element.style.transitionDelay = "0ms";
    });
  }, 1200 + Math.max(0, elements.length - 1) * 250);
});
