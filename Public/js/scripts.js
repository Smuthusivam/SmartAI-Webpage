// ------------------ Loader fade-out after delay ------------------
window.addEventListener("DOMContentLoaded", () => {
  // Prevent scroll on load
  document.body.classList.add('noscroll');

  // Start fade-out at 1.3 seconds
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.style.transition = "opacity 0.6s ease-in-out";
      loader.style.opacity = "0";
    }
  }, 1300); // 1.3 seconds

  // Remove loader and unlock scroll at 1.9 seconds
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.style.display = "none";
    }
    document.body.classList.remove('noscroll'); // Unlock scroll here
  }, 1900); // 1.9 seconds

  // ------------------ Matrix Glow on Loader Canvas ------------------
  const canvas = document.getElementById("aiGlow");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / 20);
    const yPos = Array(cols).fill(0);

    function matrixEffect() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "16px monospace";

      yPos.forEach((y, index) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = index * 20;
        ctx.fillText(text, x, y);
        yPos[index] = y > canvas.height + Math.random() * 100 ? 0 : y + 20;
      });
    }

    setInterval(matrixEffect, 50);
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  // ------------------ Load Particles ------------------
  tsParticles.loadJSON("particles-js", "/particles-config.json").then(() => {
    console.log("✅ Particles loaded");
  });

  // ------------------ Expand Feature Card ------------------
  function expandCard(cardElement, type) {
    const detailsContainer = document.getElementById("expandedCardDetails");
    const descriptions = {
      "ai-chat": "AI Chat responds to any prompt with instant, clean code.",
      "autocomplete": "Autocomplete predicts your next line in real-time.",
      "refactor": "Refactor simplifies, optimizes, and enhances readability.",
      "tutor": "Tutor explains your code and guides your learning.",
      "web-ui": "Convert screenshots or Figma into real HTML/CSS instantly.",
      "project-gen": "Build full-stack projects from a single prompt."
    };
    const videos = {
      "ai-chat": "videos/AIChatSupport.mp4",
      "autocomplete": "videos/no-prompt-ai.mp4",
      "refactor": "videos/refactor-demo.mp4",
      "tutor": "videos/tutor-demo.mp4",
      "web-ui": "videos/web-ui-demo.mp4",
      "project-gen": "videos/ProjectGeneration.mp4"
    };

    const description = descriptions[type] || "More info coming soon.";
    const videoSrc = videos[type] || "";

    detailsContainer.innerHTML = `
      <div class="p-4 mt-3 border rounded bg-dark d-flex flex-column align-items-center">
        <h4 class="text-info mb-3">${cardElement.querySelector("h5").innerText}</h4>
        <p>${description}</p>
        ${videoSrc ? `
          <video controls autoplay style="max-width: 600px; width: 100%; margin: 24px 0; border-radius: 12px; box-shadow: 0 0 24px #38bdf8;">
            <source src="${videoSrc}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        ` : ''}
        <button class="btn btn-outline-info mt-2" onclick="window.closeExpandedCard()">✕ Close</button>
      </div>`;
  }

  // Make function globally accessible
  window.expandCard = expandCard;

  // ------------------ Auto-Scroll Feature Carousel (Infinite Loop) ------------------
  const carouselWrapper = document.getElementById("feature-carousel-wrapper");
  const carouselTrack = document.getElementById("carouselTrack");
  let scrollSpeed = 1;
  let scrollPaused = false;

  // Clone cards for seamless looping
  if (carouselTrack && carouselTrack.children.length > 0) {
    const cardCount = carouselTrack.children.length;
    for (let i = 0; i < cardCount; i++) {
      const clone = carouselTrack.children[i].cloneNode(true);
      clone.classList.add("cloned");
      carouselTrack.appendChild(clone);
    }
  }

  function autoScrollCarousel() {
    if (!scrollPaused && carouselWrapper && carouselTrack) {
      carouselWrapper.scrollLeft += scrollSpeed;

      // If we've scrolled past the original set, reset to start
      if (carouselWrapper.scrollLeft >= carouselTrack.scrollWidth / 2) {
        carouselWrapper.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScrollCarousel);
  }
  autoScrollCarousel();

  // ------------------ Animate Cards On Scroll ------------------
  const carouselCards = document.querySelectorAll(".carousel-card");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.3 });

  carouselCards.forEach((el) => observer.observe(el));
});

// ------------------ Global Functions (outside DOMContentLoaded) ------------------
window.closeExpandedCard = function () {
  const detailsContainer = document.getElementById("expandedCardDetails");

  // Stop the video if it exists
  const video = detailsContainer.querySelector("video");
  if (video) {
    video.pause(); // Pause the video
    video.currentTime = 0; // Reset the video to the beginning
  }

  // Clear the expanded card details
  detailsContainer.innerHTML = "";
};
