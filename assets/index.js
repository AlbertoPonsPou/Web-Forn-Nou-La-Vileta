


window.cambiarImagen = function (imagen) {
  const imagenActiva = document.getElementById("imagenActiva");
  if (!imagenActiva || !imagen) return;

  imagenActiva.src = imagen.src;
  imagenActiva.alt = imagen.alt;
};

window.mostrarTexto = function (seccion, event) {
  const panelSeleccionado = document.getElementById(`texto-${seccion}`);
  const tabSeleccionada = event.currentTarget;
  if (!panelSeleccionado || !tabSeleccionada) return;

  document.querySelectorAll(".texto-tab").forEach((panel) => {
    panel.classList.remove("activo");
    panel.setAttribute("aria-hidden", "true");
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("activa");
    tab.setAttribute("aria-selected", "false");
    tab.setAttribute("tabindex", "-1");
  });

  panelSeleccionado.classList.add("activo");
  panelSeleccionado.setAttribute("aria-hidden", "false");
  tabSeleccionada.classList.add("activa");
  tabSeleccionada.setAttribute("aria-selected", "true");
  tabSeleccionada.removeAttribute("tabindex");
};

document.addEventListener("DOMContentLoaded", () => {
  const fadeItems = document.querySelectorAll(".fade-item");
  if ("IntersectionObserver" in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    fadeItems.forEach((item) => fadeObserver.observe(item));
  } else {
    fadeItems.forEach((item) => item.classList.add("visible"));
  }

  const fadeUpElements = Array.from(document.querySelectorAll(".fade-up"));
  const reduceFadeMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  fadeUpElements.forEach((element, index) => {
    element.style.transitionDelay = reduceFadeMotion ? "0ms" : `${index * 250}ms`;
    element.addEventListener("transitionend", () => {
      element.style.transitionDelay = "0ms";
    }, { once: true });
  });
  window.setTimeout(() => {
    fadeUpElements.forEach((element) => element.classList.add("show"));
  }, 300);
  window.setTimeout(() => {
    fadeUpElements.forEach((element) => {
      element.style.transitionDelay = "0ms";
    });
  }, 1200 + Math.max(0, fadeUpElements.length - 1) * 250);

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

  const miniaturas = document.querySelector(".miniaturas");
  if (miniaturas) {
    miniaturas.querySelectorAll("img").forEach((imagen) => {
      imagen.addEventListener("click", () => window.cambiarImagen(imagen));
      imagen.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.cambiarImagen(imagen);
        }
      });
    });

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    miniaturas.addEventListener("mousedown", (event) => {
      isDown = true;
      miniaturas.classList.add("dragging");
      startX = event.pageX - miniaturas.offsetLeft;
      scrollLeft = miniaturas.scrollLeft;
    });

    const stopDragging = () => {
      isDown = false;
      miniaturas.classList.remove("dragging");
    };

    miniaturas.addEventListener("mouseleave", stopDragging);
    miniaturas.addEventListener("mouseup", stopDragging);
    miniaturas.addEventListener("mousemove", (event) => {
      if (!isDown) return;
      event.preventDefault();
      const x = event.pageX - miniaturas.offsetLeft;
      miniaturas.scrollLeft = scrollLeft - (x - startX) * 2;
    });
  }

  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  tabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (event) => {
      let targetIndex;
      if (event.key === "ArrowRight") targetIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") targetIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") targetIndex = 0;
      if (event.key === "End") targetIndex = tabs.length - 1;
      if (targetIndex === undefined) return;

      event.preventDefault();
      tabs[targetIndex].focus();
      tabs[targetIndex].click();
    });
  });

  const slides = Array.from(document.querySelectorAll(".slidecarousel"));
  if (slides.length > 1) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileSlides = window.matchMedia("(max-width: 768px)");
    const banner = document.querySelector(".banner");
    let current = 0;
    let carouselTimer;
    let carouselInView = true;

    const getSlideImageUrl = (slide) => {
      const styles = window.getComputedStyle(slide);
      const property = mobileSlides.matches ? "--slide-image-mobile" : "--slide-image";
      const cssUrl = styles.getPropertyValue(property).trim()
        || styles.getPropertyValue("--slide-image").trim();
      return cssUrl.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
    };

    const preloadRemainingSlides = async () => {
      for (const slide of slides.slice(1)) {
        const imageUrl = getSlideImageUrl(slide);
        if (!imageUrl) continue;

        await new Promise((resolve) => {
          const image = new Image();
          image.decoding = "async";
          image.fetchPriority = "low";
          const finishPreload = () => {
            slide.classList.add("is-loaded");
            resolve();
          };
          image.onload = finishPreload;
          image.onerror = finishPreload;
          image.src = imageUrl;
        });
      }
    };

    window.setTimeout(preloadRemainingSlides, 1200);

    const advanceCarousel = () => {
      slides[current].classList.remove("active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");
    };
    const startCarousel = () => {
      if (!carouselTimer && !document.hidden && !reducedMotion.matches && carouselInView) {
        carouselTimer = window.setInterval(advanceCarousel, 6000);
      }
    };
    const stopCarousel = () => {
      window.clearInterval(carouselTimer);
      carouselTimer = undefined;
    };

    startCarousel();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopCarousel();
      else startCarousel();
    });
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) stopCarousel();
      else startCarousel();
    });

    if (banner && "IntersectionObserver" in window) {
      const bannerObserver = new IntersectionObserver((entries) => {
        carouselInView = entries[0]?.isIntersecting ?? true;
        if (carouselInView) startCarousel();
        else stopCarousel();
      });
      bannerObserver.observe(banner);
    }
  }

  const clientsCarousel = document.querySelector(".carousel");
  if (clientsCarousel && "IntersectionObserver" in window) {
    const clientsObserver = new IntersectionObserver((entries) => {
      clientsCarousel.classList.toggle("is-paused", !entries[0]?.isIntersecting);
    });
    clientsObserver.observe(clientsCarousel);
  }

  const reviewsCarousel = document.querySelector("[data-reviews-carousel]");
  const reviewsPrev = document.querySelector("[data-reviews-prev]");
  const reviewsNext = document.querySelector("[data-reviews-next]");

  if (reviewsCarousel && reviewsPrev && reviewsNext) {
    const originalReviews = Array.from(reviewsCarousel.querySelectorAll(".resena-card"));

    const createReviewCopies = () => {
      const fragment = document.createDocumentFragment();
      originalReviews.forEach((card) => {
        const copy = card.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        fragment.append(copy);
      });
      return fragment;
    };

    reviewsCarousel.prepend(createReviewCopies());
    reviewsCarousel.append(createReviewCopies());

    const reviewStep = () => {
      const firstCard = reviewsCarousel.querySelector(".resena-card");
      if (!firstCard) return reviewsCarousel.clientWidth;
      const gap = Number.parseFloat(getComputedStyle(reviewsCarousel).gap) || 0;
      return firstCard.getBoundingClientRect().width + gap;
    };

    const reviewSetWidth = () => reviewStep() * originalReviews.length;

    const jumpToReviewPosition = (left) => {
      const previousBehavior = reviewsCarousel.style.scrollBehavior;
      reviewsCarousel.style.scrollBehavior = "auto";
      reviewsCarousel.scrollLeft = left;
      reviewsCarousel.style.scrollBehavior = previousBehavior;
    };

    const normalizeReviewPosition = () => {
      const setWidth = reviewSetWidth();
      if (!setWidth) return;

      if (reviewsCarousel.scrollLeft < setWidth * 0.5) {
        jumpToReviewPosition(reviewsCarousel.scrollLeft + setWidth);
      } else if (reviewsCarousel.scrollLeft > setWidth * 2.5) {
        jumpToReviewPosition(reviewsCarousel.scrollLeft - setWidth);
      }
    };

    const moveReviews = (direction) => {
      reviewsCarousel.scrollBy({ left: direction * reviewStep(), behavior: "smooth" });
    };

    requestAnimationFrame(() => jumpToReviewPosition(reviewSetWidth()));

    reviewsPrev.addEventListener("click", () => {
      moveReviews(-1);
    });

    reviewsNext.addEventListener("click", () => {
      moveReviews(1);
    });

    reviewsCarousel.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      moveReviews(event.key === "ArrowRight" ? 1 : -1);
    });

    let reviewScrollTimer;
    reviewsCarousel.addEventListener("scroll", () => {
      window.clearTimeout(reviewScrollTimer);
      reviewScrollTimer = window.setTimeout(normalizeReviewPosition, 120);
    }, { passive: true });

    window.addEventListener("resize", () => {
      window.clearTimeout(reviewScrollTimer);
      reviewScrollTimer = window.setTimeout(() => jumpToReviewPosition(reviewSetWidth()), 100);
    });
  }

});
