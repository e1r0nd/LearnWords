import repeatTmp from "./Repeat.html";
import "./Repeat.scss";

import button from "../Button";
import input from "../Input";

import Storage from "browser-lsc-storage";
const storage = Storage.local;
storage.prefix = "LWdb";

import Words from "../../actions/Words";

import Settings from "../Settings";
import Learn from "../Learn";

const Repeat = {
  createBlock() {
    const enterBtn = button({
      "id": "enterBtn",
      "label": "Check",
      "class": "btn btn-primary",
      "dataLang": "enterBtn",
    });
    const enterInp = input({
      "id": "inputWord",
      "label": "word:",
      "placeholder": "Enter word",
    });

    const buttons = enterBtn;
    const inputs = enterInp;
    const html = document.createElement("div");
    html.id = "repeat";
    html.classList.add("u--center", "u--nodisplay");
    html.dataset.toggle = "nav";
    html.innerHTML = repeatTmp
      .replace(/{{buttons}}/g, buttons)
      .replace(/{{inputs}}/g, inputs);

    return html;
  },

  init() {
    this.wordsRepeat = {
      first: [],
      second: [],
      third: [],
    };
    this.repeatWordsNum = document.querySelector("#repeatWordsNum");
    this.repeatWordsTopNum = document.querySelector("#repeatWordsTopNum");
    this.checkWord = document.querySelector("#checkWord");
    this.checkWordInp = document.querySelector("#checkWordInp");
    this.enterWordInp = document.querySelector("#enterWordInp");
    this.enterWord = document.querySelector("#enterWord");
    this.inputWord = document.querySelector("#inputWord");
    this.noWordsRepeat = document.querySelector("#noWordsRepeat");
    this.enterBtn = document.querySelector("#enterBtn");
    this.arrOptionButtons = document.querySelectorAll("[data-type=checkWordBtn]");
    this.Vocabulary = {
      translates: [],
      words: [],
    };
    this.words = storage.key("words");

    this.arrOptionButtons.forEach((node) => {
      node.addEventListener("click", () => {
        this.checkThisWord(this);
      });
    });
    document.querySelector("#enterBtn").addEventListener("click", this.repeatWord.bind(this));
  },

  getToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
  },

  recountIndexRepeat() {
    // Count words to Repeat
    if (!this.wordsRepeat.first.length && !this.wordsRepeat.second.length && !this.wordsRepeat.third.length) {
      const wordsList = storage.key("words");
      wordsList.forEach((item) => { // Initial counting
        if (item && (this.getToday() > item.date)) { // If this word is for today
          if ("1" === item.step) {
            this.wordsRepeat.first.push(item);
          } else if ("2" === item.step) {
            this.wordsRepeat.second.push(item);
          }
          if ("3" === item.step) {
            this.wordsRepeat.third.push(item);
          }
        }
        this.Vocabulary.translates.push(item.translate);
        this.Vocabulary.words.push(item.word);
      });
    }
    const wordsRepeatTotal =
      this.wordsRepeat.first.length
      + this.wordsRepeat.second.length
      + this.wordsRepeat.third.length;

    this.repeatWordsNum.innerText = this.repeatWordsTopNum.innerText = wordsRepeatTotal || "0";

    this.showWord();
  },

  showWord() { // Show a next word to Repeat
    let wordPlaceholder = "";

    function getWord(index, arrWords) {
      // If index is 0 we get the correct word. The other words are random
      if (0 === index) {
        wordPlaceholder =
          this.wordsRepeat[
            (this.wordsRepeat.first.length) ? "first" : "second"][0][
              (this.wordsRepeat.first.length) ? "translate" : "word"];
      } else {
        wordPlaceholder = this.Vocabulary[
          (this.wordsRepeat.first.length)
          ? "translates"
          : "words"][this.getRandomInt(0, this.Vocabulary[
            (this.wordsRepeat.first.length) ? "translates" : "words"
          ].length - 1)
        ];
      }

      if (arrWords.includes(wordPlaceholder)) {
        getWord.call(this, index, arrWords);
      }

      return wordPlaceholder;
    }

    if (this.wordsRepeat.first.length || this.wordsRepeat.second.length) {
      // const id = this.wordsRepeat[(this.wordsRepeat.first.length) ? "first" : "second"][0].index;
      const arrWords = [];
      this.checkWordInp.innerText = (this.wordsRepeat[(this.wordsRepeat.first.length)
        ? "first"
        : "second"][0][(this.wordsRepeat.first.length) ? "word" : "translate"]); // .data("id", id);

      // The answer buttons are shuffled so that we don"t know which one is the correct word.
      this.shuffle(this.arrOptionButtons);

      this.arrOptionButtons.forEach((node, index) => {
        wordPlaceholder = getWord.call(this, index, arrWords);
        arrWords[index] = wordPlaceholder;
        node.innerText = wordPlaceholder;
      });
      this.enterBtn.dataset.direction = true;
      this.checkWord.classList.remove("u--nodisplay");
      this.enterWord.classList.add("u--nodisplay");
      this.noWordsRepeat.classList.add("u--nodisplay");
    } else if (this.wordsRepeat.third.length) {
      this.enterWordInp.innerText = this.wordsRepeat.third[0].translate;
      this.checkWord.classList.add("u--nodisplay");
      this.enterWord.classList.remove("u--nodisplay");
      this.noWordsRepeat.classList.add("u--nodisplay");
    } else {
      this.checkWord.classList.add("u--nodisplay");
      this.enterWord.classList.add("u--nodisplay");
      this.noWordsRepeat.classList.remove("u--nodisplay");
    }
  },

  actionWord(step, reindex, word = {}) {
    if (step) {
      this.words = Words.storeWord(word);

      if (reindex) {
        this.wordsRepeat.splice(this.currentIndex, 1); // Remove from index
        this.recountIndexRepeat();
      } else {
        this.currentIndex = this.currentIndex + 1;
      }
    } else {
      this.currentIndex = this.currentIndex + 1;
    }

    if (this.currentIndex >= this.wordsRepeat.length) {
      this.currentIndex = 0;
    }
    this.showWord(this.currentIndex);
  },

  checkThisWord(self) {
    const word = {
      index: this.wordsRepeat[(this.wordsRepeat.first.length) ? "first" : "second"][0].index,
      word: this.wordsRepeat[(this.wordsRepeat.first.length) ? "first" : "second"][0].word,
      translate: this.wordsRepeat[(this.wordsRepeat.first.length) ? "first" : "second"][0].translate,
      step: this.wordsRepeat[(this.wordsRepeat.first.length) ? "first" : "second"][0].step,
    };

    if (self.innerText === ((this.wordsRepeat.first.length) ? word.translate : word.word)) {
      word.step = (+word.step + 1).toString();
      word.date = this.getToday() + 864000000 * Settings.params[(this.wordsRepeat.first.length) ? "second" : "third"];
    } else {
      word.step = (+word.step - 1).toString();
      word.date = (this.wordsRepeat.first.length) ? 0 : this.getToday() + 864000000 * Settings.params.first;
    }

    this.storeWord(word); // Save word
    this.wordsRepeat[(this.wordsRepeat.first.length) ? "first" : "second"].splice(0, 1); // Remove from index
    Learn.wordsLearn = [];
    Learn.recountIndexLearn();
    Learn.showWord();
    this.recountIndexRepeat();
    this.showWord();
  },

  repeatWord() {
    const word = {
      index: this.wordsRepeat.third[0].index,
      word: this.wordsRepeat.third[0].word,
      translate: this.wordsRepeat.third[0].translate,
      step: this.wordsRepeat.third[0].step,
    };
    if (this.enterWordInp.value === word.word) {
      word.step = (+word.step + 1).toString();
      word.date = 0;
    } else {
      word.step = (+word.step - 1).toString();
      word.date = this.getToday() + 864000000 * Settings.params.second;
    }

    this.storeWord(word); // Save word
    this.wordsRepeat.third.splice(0, 1); // Remove from index
    Learn.wordsLearn = [];
    Learn.recountIndexLearn();
    Learn.showWord();
    this.recountIndexRepeat();
    this.showWord();
  },

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  shuffle(a) {
    let j;
    let x;
    let i;
    for (i = a.length; i; i = i - 1) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  },
};

export default Repeat;
