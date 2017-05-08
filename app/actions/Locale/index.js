import Storage from "browser-lsc-storage";
const cookies = Storage.cookie;

import enGB from "../../i18n/locale-en.json";
import ruRU from "../../i18n/locale-ru.json";
import deDE from "../../i18n/locale-de.json";

const locale = {
  en_GB: enGB,
  de_DE: deDE,
  ru_RU: ruRU,
  changelocaleContent() {
    // Change inner content
    const langNode = document.querySelectorAll("[data-toggle=lang]");
    const langSelect = document.querySelectorAll("[data-type=lang-select]");

    langNode.forEach((node) => {
      node.innerText = this[this.currentLocale][node.dataset.lang];
    });
    langSelect.forEach((node) => {
      node.classList.remove("selected");
    });
  },

  langSelect(e) { // change localization
    e.preventDefault();
    locale.currentLocale = this.dataset.lang;
    // document.querySelector("#langSelect").click();
    // document.querySelector(".navbar-toggle:visible").click();
    locale.changelocaleContent();
    cookies.key("language", locale.currentLocale);
    this.classList.add("selected");
  },

  init() {
    // Read user's locale or set English by default
    this.currentLocale = cookies.key("language") || "en_GB";
    document
      .querySelectorAll("[data-type=lang-select]")
      .forEach((node) => {
        node.addEventListener("click", this.langSelect);
      });

    // Set user saved locale
    if (this.currentLocale !== document.querySelector("[data-type=lang-select].selected").dataset.lang) {
      document.querySelector(`[data-lang=${this.currentLocale}]`).click();
    }
  },
};

export { locale };
