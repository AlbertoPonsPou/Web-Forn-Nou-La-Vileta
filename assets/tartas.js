document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".masonry-item img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");
  const nextBtn = document.querySelector(".lightbox-next");
  const prevBtn = document.querySelector(".lightbox-prev");

  let currentIndex = 0;
  const imgArray = Array.from(images);

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = imgArray[currentIndex].src;
    lightbox.classList.add("active");
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imgArray.length;
    lightboxImg.src = imgArray[currentIndex].src;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imgArray.length) % imgArray.length;
    lightboxImg.src = imgArray[currentIndex].src;
  }

  images.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
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
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".masonry-item");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // pequeño delay progresivo
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 80);

          observer.unobserve(entry.target); // solo una vez
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  items.forEach(item => observer.observe(item));
});
