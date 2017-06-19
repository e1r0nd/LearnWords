import navigationTmp from "./Navigation.html";
import "./Navigation.scss";

import Detabinator from "./detabinator";
import locale from "../../actions/Locale";

import badge from "../Badge";

const Navigation = {
  init() {
    this.selected = "summary";
    document
      .querySelectorAll("[data-type=nav-select]")
      .forEach((node) => {
        node.addEventListener("click", this.navSelect.bind(this));
      });

    this.navTitle = document.querySelector("#sideNavTitle");
    this.showButtonEl = document.querySelector("#menuShow");
    this.hideButtonEl = document.querySelector("#menuHide");
    this.sideNavEl = document.querySelector("#sideNav");
    this.sideNavContainerEl = document.querySelector("#sideNavContainer");
    // Control whether the container"s children can be focused
    // Set initial state to inert since the drawer is offscreen
    this.detabinator = new Detabinator(this.sideNavContainerEl);
    this.detabinator.inert = true;

    this.showSideNav = this.showSideNav.bind(this);
    this.hideSideNav = this.hideSideNav.bind(this);
    this.blockClicks = this.blockClicks.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.update = this.update.bind(this);

    this.startX = 0;
    this.currentX = 0;
    this.touchingSideNav = false;

    this.supportsPassive = null;
    this.addEventListeners();

    if ("onhashchange" in window) {
      window.onhashchange = this.hashbreak;
      this.hashbreak();
    } else {
      this.hashguard(false);
    }
  },

  createBlock() {
    const badgeLearnWordsTopNum = badge({
      "id": "learnWordsTopNum",
      "label": "",
      "class": "",
    });
    const badgeRepeatWordsTopNum = badge({
      "id": "repeatWordsTopNum",
      "label": "",
      "class": "",
    });

    const html = document.createElement("div");
    html.classList.add("navigation");
    html.innerHTML = navigationTmp
      .replace(/{{badgeLearnWordsTopNum}}/g, badgeLearnWordsTopNum)
      .replace(/{{badgeRepeatWordsTopNum}}/g, badgeRepeatWordsTopNum);

    return html;
  },

  hashguard(init) { // onHashChange
    if (init) {
      this.hash = window.location.hash;
    }
    if (this.hash !== window.location.hash) {
      this.hashbreak();
      this.hash = window.location.hash;
    }
    setTimeout(this.hashguard.bind(this), 300);
  },

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
  },

  navSelect(e) {
    // Hide previous tab
    document
      .querySelector(`#${this.selected}Nav`)
      .classList.remove("active");
    document
      .querySelector(`#${this.selected}`)
      .classList.add("u--nodisplay");
    // Store current Tab and show it
    this.selected = e.currentTarget.dataset.target;
    document
      .querySelector(`#${this.selected}Nav`)
      .classList.add("active");
    document
      .querySelector(`#${this.selected}`)
      .classList.remove("u--nodisplay");
    // Change Title and hide Nav
    this.navTitle.dataset.lang = this.selected;
    this.navTitle.innerHTML = locale.getWord(this.selected);
    this.hideSideNav();
  },

  // apply passive event listening if it"s supported
  applyPassive() {
    if (null !== this.supportsPassive) {
      return this.supportsPassive ? { passive: true } : false;
    }
    // feature detect
    let isSupported = false;
    try {
      document.addEventListener("test", null, { get passive() {
        isSupported = true;
      } });
    } catch (e) {
      console.log(e);
    }
    this.supportsPassive = isSupported;
    return this.applyPassive();
  },

  addEventListeners() {
    this.showButtonEl.addEventListener("click", this.showSideNav);
    this.hideButtonEl.addEventListener("click", this.hideSideNav);
    this.sideNavEl.addEventListener("click", this.hideSideNav);
    this.sideNavContainerEl.addEventListener("click", this.blockClicks);

    this.sideNavEl.addEventListener("touchstart", this.onTouchStart, this.applyPassive());
    this.sideNavEl.addEventListener("touchmove", this.onTouchMove, this.applyPassive());
    this.sideNavEl.addEventListener("touchend", this.onTouchEnd);
  },

  onTouchStart(evt) {
    if (!this.sideNavEl.classList.contains("side-nav--visible")) {
      return;
    }

    this.startX = evt.touches[0].pageX;
    this.currentX = this.startX;

    this.touchingSideNav = true;
    requestAnimationFrame(this.update);
  },

  onTouchMove(evt) {
    if (!this.touchingSideNav) {
      return;
    }

    this.currentX = evt.touches[0].pageX;
  },

  onTouchEnd() {
    if (!this.touchingSideNav) {
      return;
    }

    this.touchingSideNav = false;

    const translateX = Math.min(0, this.currentX - this.startX);
    this.sideNavContainerEl.style.transform = "";

    if (translateX < 0) {
      this.hideSideNav();
    }
  },

  update() {
    if (!this.touchingSideNav) {
      return;
    }

    requestAnimationFrame(this.update);

    const translateX = Math.min(0, this.currentX - this.startX);
    this.sideNavContainerEl.style.transform = `translateX(${translateX}px)`;
  },

  blockClicks(evt) {
    evt.stopPropagation();
  },

  onTransitionEnd(e) {
    if ("transform" === e.propertyName) {
      this.sideNavEl.classList.remove("side-nav--animatable");
      this.sideNavEl.removeEventListener("transitionend", this.onTransitionEnd);
    }
  },

  showSideNav() {
    this.sideNavEl.classList.add("side-nav--animatable");
    this.sideNavEl.classList.add("side-nav--visible");
    this.detabinator.inert = false;
    this.sideNavEl.addEventListener("transitionend", this.onTransitionEnd);
  },

  hideSideNav() {
    this.sideNavEl.classList.add("side-nav--animatable");
    this.sideNavEl.classList.remove("side-nav--visible");
    this.detabinator.inert = true;
    this.sideNavEl.addEventListener("transitionend", this.onTransitionEnd);
  },
};

export default Navigation;
