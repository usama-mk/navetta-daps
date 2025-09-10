// Initialize AOS (Animate On Scroll) library
document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    offset: 100,
  });
});

// Mobile Navigation Toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function () {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offsetTop = section.offsetTop - 70; // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

// Navbar background change on scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "none";
  }
});

// Form submission handling
const quoteForm = document.getElementById("quote-form");
if (quoteForm) {
  quoteForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(quoteForm);
    const data = Object.fromEntries(formData);

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.service) {
      showNotification(
        "Please fill in all required fields (Name, Email, Phone, and Service).",
        "error"
      );
      return;
    }

    // Show loading state
    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Opening Email...';
    submitBtn.disabled = true;

    // Create email content
    const subject = encodeURIComponent("New Quote Request - DAPS Dumpsters");
    const body = encodeURIComponent(`
Hello DAPS Dumpsters,

I would like to request a free quote for your services.

CONTACT INFORMATION:
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

SERVICE REQUESTED:
${data.service}

PROJECT DETAILS:
${data.message || "No additional details provided"}

Please contact me at your earliest convenience to discuss my project and provide a quote.

Thank you,
${data.name}
    `);

    // Create mailto link
    const mailtoLink = `mailto:contact@dapsdumpsters.com?subject=${subject}&body=${body}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show success message
    setTimeout(() => {
      showNotification(
        "Your email client should now be open. Please send the email to complete your quote request.",
        "success"
      );

      // Reset form
      quoteForm.reset();

      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1000);
  });
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${
              type === "success"
                ? "fa-check-circle"
                : type === "error"
                ? "fa-exclamation-circle"
                : "fa-info-circle"
            }"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : "#2563eb"};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

  // Add to page
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => notification.remove(), 300);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Parallax effect for hero section
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector(".hero-background");

  if (heroBackground) {
    const rate = scrolled * -0.5;
    heroBackground.style.transform = `translateY(${rate}px)`;
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("loaded");
    }
  });
}, observerOptions);

// Observe elements for loading animation
document.addEventListener("DOMContentLoaded", function () {
  const elementsToAnimate = document.querySelectorAll(
    ".service-card, .feature-item, .contact-item"
  );
  elementsToAnimate.forEach((element) => {
    element.classList.add("loading");
    observer.observe(element);
  });
});

// Counter animation for stats
function animateCounters() {
  const counters = document.querySelectorAll(".stat-item h3");

  counters.forEach((counter) => {
    const target = parseInt(counter.textContent.replace(/\D/g, ""));
    const increment = target / 50;
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent =
          Math.ceil(current) + (counter.textContent.includes("+") ? "+" : "");
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent =
          target + (counter.textContent.includes("+") ? "+" : "");
      }
    };

    updateCounter();
  });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const statsSection = document.querySelector(".stats-overlay");
if (statsSection) {
  statsObserver.observe(statsSection);
}

// Smooth reveal animation for service cards
function revealServiceCards() {
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 200);
  });
}

// Trigger service card animation when services section is visible
const servicesObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealServiceCards();
        servicesObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const servicesSection = document.querySelector(".services");
if (servicesSection) {
  servicesObserver.observe(servicesSection);
}

// Floating animation for hero elements
function createFloatingAnimation() {
  const floatingElements = document.querySelectorAll(".floating-card");

  floatingElements.forEach((element) => {
    let floatDirection = 1;
    let floatPosition = 0;

    function float() {
      floatPosition += floatDirection * 0.5;

      if (floatPosition > 10) {
        floatDirection = -1;
      } else if (floatPosition < -10) {
        floatDirection = 1;
      }

      element.style.transform = `translateY(${floatPosition}px)`;
      requestAnimationFrame(float);
    }

    float();
  });
}

// Initialize floating animation after page load
window.addEventListener("load", function () {
  setTimeout(createFloatingAnimation, 1000);
});

// Button hover effects
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-3px)";
  });

  button.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });
});

// Service card hover effects
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Loading screen (optional)
window.addEventListener("load", function () {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }
});

// Error handling for images
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", function () {
    // Replace with placeholder if image fails to load
    this.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg==";
  });
});

// Performance optimization: Lazy loading for images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// Add smooth transitions to all interactive elements
document
  .querySelectorAll("a, button, .service-card, .contact-item")
  .forEach((element) => {
    element.style.transition = "all 0.3s ease";
  });

// Console welcome message
console.log(
  "%c🚛 Welcome to DAPS Junk Removal!",
  "color: #2563eb; font-size: 16px; font-weight: bold;"
);
console.log(
  "%cProfessional junk removal and dumpster rental services",
  "color: #64748b; font-size: 12px;"
);
