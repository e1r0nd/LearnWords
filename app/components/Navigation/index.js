import navigationTmp from "./Navigation.html";
import "./Navigation.scss";

export default class NavigationClass {
  constructor() {
    this.selected = "summary";
  }

  createBlock() {
    const html = document.createElement("nav");
    html.classList.add("navigation");
    html.innerHTML = navigationTmp;

    return html;
  }

  init() {
    document.querySelectorAll("[data-type=nav-select]").forEach((node) => {
      node.addEventListener("click", this.navSelect.bind(this));
    });

    this.hashguard(false);
  }

  hashguard(init) { // onHashChange
    if (init) {
      this.hash = window.location.hash;
    }
    if (this.hash !== window.location.hash) {
      this.hashbreak();
      this.hash = window.location.hash;
    }
    setTimeout(this.hashguard.bind(this), 300);
  }

  hashbreak() { // hashchange event
    let node = null;
    try {
      node = document.querySelector(`[data-target=${window.location.hash.slice(3)}]`);
    } catch (e) {
      console.log(`WOAH! ${e.name}:${e.message}`);
    }

    if (node) {
      node.click();
    } else {
      document.querySelector("[data-target=summary]").click();
    }
  }

  navSelect(e) {
    // Hide previous tab
    document
      .querySelector(`#${this.selected}Nav`).classList.remove("active");
    document
      .querySelector(`#${this.selected}`).classList.add("nodisplay");

    // Store current Tab and show it
    this.selected = e.currentTarget.dataset.target;
    document
      .querySelector(`#${this.selected}Nav`).classList.add("active");
    document
      .querySelector(`#${this.selected}`).classList.remove("nodisplay");
  }
}
