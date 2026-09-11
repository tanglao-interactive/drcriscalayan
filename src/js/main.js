// Load Styles
import '../scss/main.scss';

// Load Bootstrap init
import {initBootstrap} from "./bootstrap.js";

// Loading bootstrap with optional features
initBootstrap({
  tooltip: true,
  popover: true,
  toasts: true,
});

const formStatus = document.querySelector("#form-status");

if (formStatus && new URLSearchParams(window.location.search).get("sent") === "1") {
  formStatus.textContent = "Thank you. Your message has been sent.";
  formStatus.classList.remove("d-none");
  formStatus.focus();
}

const trackClick = (eventName, parameters) => {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, parameters);
};

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");

  if (!link || !link.href) {
    return;
  }

  const href = link.href;
  const linkText = link.textContent.trim().replace(/\s+/g, " ");
  const clickDetails = {
    link_url: href,
    link_text: linkText,
    page_path: window.location.pathname,
  };

  if (href.includes("a.co/d/0hcpKVx6")) {
    trackClick("amazon_book_click", {
      ...clickDetails,
      outbound: true,
    });
    return;
  }

  if (href.endsWith("#book") && linkText === "Read About Unbroken") {
    trackClick("read_about_unbroken_click", clickDetails);
    return;
  }

  if (href.includes("linkedin.com")) {
    trackClick("social_link_click", {
      ...clickDetails,
      social_platform: "LinkedIn",
      outbound: true,
    });
    return;
  }

  if (href.includes("facebook.com")) {
    trackClick("social_link_click", {
      ...clickDetails,
      social_platform: "Facebook",
      outbound: true,
    });
  }
});
