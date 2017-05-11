import learnTmp from "./Learn.html";
import "./Learn.scss";

import button from "../Button";

import storage from "browser-lsc-storage";
const localStorage = storage.local;
localStorage.prefix = "LWdb";
import { locale } from "../../actions/Locale";

const Learn = {
  init() {
    this.wordsLearn = [];
    this.currentIndex = 0;
    this.learnWordsNum = document.querySelector("#learnWordsNum");
    this.learnWordsTopNum = document.querySelector("#learnWordsTopNum");
    this.learnWordsTopSNum = document.querySelector("#learnWordsTopSNum");
    this.learnWord = document.querySelector("#learnWord");
    this.translateWord = document.querySelector("#translateWord");
    this.learnWordsGrp = document.querySelector("#learnWordsGrp");
    this.noWordsLeft = document.querySelector("#noWordsLeft");
    this.allWordsOk = document.querySelector("#allWordsOk");

    document.querySelector("#rememberBtn").addEventListener("click", this.rememberWord.bind(this));
    document.querySelector("#repeatBtn").addEventListener("click", this.repeatWord.bind(this));
    document.querySelector("#knownBtn").addEventListener("click", this.knownWord.bind(this));
  },

  createBlock() {
    const rememberBtn = button({
      "id": "rememberBtn",
      "label": "Remember",
      "class": "btn btn-primary",
      "dataLang": "rememberBtn",
    });
    const repeatBtn = button({
      "id": "repeatBtn",
      "label": "Repeat",
      "class": "btn btn-primary",
      "dataLang": "repeatBtn",
    });
    const knownBtn = button({
      "id": "knownBtn",
      "label": "Known",
      "class": "btn btn-primary",
      "dataLang": "knownBtn",
    });
    const buttons = rememberBtn + repeatBtn + knownBtn;
    const html = document.createElement("div");
    html.id = "learn";
    html.classList.add("center", "nodisplay");
    html.dataset.toggle = "nav";
    html.innerHTML = learnTmp.replace(/{{buttons}}/g, buttons);

    return html;
  },

  recountIndexLearn() { // Count words to learn
    if (!this.wordsLearn.length) {
      const index = localStorage.key("words").split(",");
      index.forEach((node) => { // The initial counting
        const item = localStorage.key(node);
        if (item && 0 === item.step) {
          this.wordsLearn.push(item);
        }
      });
    }

    console.log("Learn recountIndexLearn", this.wordsLearn);
    const wordsLearnLength = this.wordsLearn.length || "";

    this.learnWordsNum.innerText = wordsLearnLength || "0";
    // $(learnWordsTopNum).text(wordsLearnLength);
    // $(learnWordsTopSNum).text(wordsLearnLength);
  },

  showWord() { // Show a next word to learn
    if (this.wordsLearn.length) {
      this.learnWord.innerText = this.wordsLearn[this.currentIndex].word;
      this.translateWord.innerText = this.wordsLearn[this.currentIndex].translate;
      this.learnWordsGrp.classList.remove("nodisplay");
      this.noWordsLeft.classList.add("nodisplay");
    } else {
      this.allWordsOk.innerText = locale[locale.currentLocale].allWordsOk;
      this.noWordsLeft.classList.remove("nodisplay");
      this.learnWordsGrp.classList.add("nodisplay");
    }
  },

  actionWord(step, reindex) {
    if (step) {
      const getToday = () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
      };
      const word = {
        index: this.wordsLearn[this.currentIndex].index,
        word: this.wordsLearn[this.currentIndex].word,
        translate: this.wordsLearn[this.currentIndex].translate,
        step,
        date: (1 === step) ? (getToday() + 864000000 * 1/* Settings.params.first*/) : 0,
      };

      localStorage.key(this.wordsLearn[this.currentIndex].index, word); // Save word

      if (reindex) {
        this.wordsLearn.splice(this.currentIndex, 1); // Remove from index
        this.recountIndexLearn();
      } else {
        this.currentIndex = this.currentIndex + 1;
      }
    } else {
      this.currentIndex = this.currentIndex + 1;
    }

    if (this.currentIndex >= this.wordsLearn.length) {
      this.currentIndex = 0;
    }
    this.showWord();
  },

  rememberWord() {
    this.actionWord(1, true);
  },

  repeatWord() {
    this.actionWord(0);
  },

  knownWord() {
    this.actionWord(4, true);
  },
};

export default Learn;
