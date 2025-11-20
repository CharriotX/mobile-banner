let selectedPlanHref = null;

const planButtons = document.querySelectorAll(".plan-btn");

planButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();

    planButtons.forEach((btn) => {
      btn.classList.remove("selected");
      const badge = btn.querySelector(".plan-btn__badge");
      if (badge) {
        badge.classList.remove("selected");
      }
    });

    this.classList.add("selected");
    const currentBadge = this.querySelector(".plan-btn__badge");
    if (currentBadge) {
      currentBadge.classList.add("selected");
    }

    selectedPlanHref = this.parentElement.getAttribute("href");
  });
});

const confirmButton = document.getElementById("continue-btn");
confirmButton.addEventListener("click", function () {
  if (selectedPlanHref) {
    window.location.href = selectedPlanHref;
  } else {
    alert("Выберите план");
  }
});

let translations = {};
let currentLanguage = "en";

async function loadTranslation(lang) {
  try {
    const response = await fetch(`./i18n/${lang}.json`);
    if (!response.ok) throw new Error("File not found");
    return await response.json();
  } catch (error) {
    console.warn(`Translation for ${lang} not found, using English`);
    return await loadTranslation("en");
  }
}
async function setLanguage(lang) {
  document.documentElement.lang = lang;
  translations[lang] = await loadTranslation(lang);
  currentLanguage = lang;
  applyTranslations();
}

function applyTranslations() {
  const elements = document.querySelectorAll("[data-i18n]");

  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const translation = translations[currentLanguage][key];

    if (translation) {
      if (translation.includes("{{price}}") && element.dataset.price) {
        element.innerHTML = translation.replace(
          "{{price}}",
          element.dataset.price
        );
      } else {
        element.innerHTML = translation;
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLanguage = urlParams.get("lang");

  const langToLoad = urlLanguage || "en";
  await setLanguage(langToLoad);
});
