import learnTmp from "./Learn.html";
import "./Learn.scss";

import button from "../Button";

import Storage from "browser-lsc-storage";
const storage = Storage.local;
storage.prefix = "LWdb";

import Settings from "../Settings";

import locale from "../../actions/Locale";
import Words from "../../actions/Words";

const Learn = {
  init() {
    this.wordsLearn = [];
    this.currentIndex = 0;
    this.learnWordsNum = document.querySelector("#learnWordsNum");
    this.learnWordsTopNum = document.querySelector("#learnWordsTopNum");
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
    html.classList.add("u--center", "u--nodisplay");
    html.dataset.toggle = "nav";
    html.innerHTML = learnTmp.replace(/{{buttons}}/g, buttons);

    return html;
  },

  recountIndexLearn() { // Count words to learn
    this.wordsLearn = [];

    const wordsList = storage.key("words");
    wordsList.forEach((item) => { // The initial counting
      if (item && "0" === item.step) {
        this.wordsLearn.push(item);
      }
    });

    const wordsLearnLength = this.wordsLearn.length || "0";

    this.learnWordsNum.innerText = this.learnWordsTopNum.innerText = wordsLearnLength;
    this.showWord();
  },

  showWord() { // Show a next word to learn
    if (this.wordsLearn.length) {
      this.learnWord.innerText = this.wordsLearn[this.currentIndex].word;
      this.translateWord.innerText = this.wordsLearn[this.currentIndex].translate;
      this.learnWordsGrp.classList.remove("u--nodisplay");
      this.noWordsLeft.classList.add("u--nodisplay");
    } else {
      this.allWordsOk.innerText = locale[locale.currentLocale].allWordsOk;
      this.noWordsLeft.classList.remove("u--nodisplay");
      this.learnWordsGrp.classList.add("u--nodisplay");
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
        date: ("1" === step) ? (getToday() + 864000000 * Settings.params.first) : 0,
      };

      Words.storeWord(word);

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
    this.actionWord("1", true);
  },

  repeatWord() {
    this.actionWord("0");
  },

  knownWord() {
    this.actionWord("4", true);
  },
};

export default Learn;
