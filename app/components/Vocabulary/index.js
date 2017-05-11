import vocabularyTmp from "./Vocabulary.html";
import "./Vocabulary.scss";

import rowTemplate from "../row-word/row-word.html";

import button from "../Button";
// import input from "../Input";

import locale from "../../actions/Locale";

import storage from "browser-lsc-storage";
const localStorage = storage.local;
localStorage.prefix = "LWdb";

import Repeat from "../Repeat";
import Learn from "../Learn";

const Vocabulary = {
  createBlock() {
    const rememberBtn = button({
      "id": "rememberBtn",
      "label": "Remember",
      "class": "btn btn-primary",
      "dataLang": "rememberBtn",
    });

    const buttons = rememberBtn;
    const html = document.createElement("div");
    html.id = "vocabulary";
    html.classList.add("center", "nodisplay");
    html.dataset.toggle = "nav";
    html.innerHTML = vocabularyTmp.replace(/{{buttons}}/g, buttons);

    return html;
  },

  init() {
    this.rowTemplate = rowTemplate;
    this.words = [];
    this.translates = [];

    this.repeatWordsNum = document.querySelector("#repeatWordsNum");
    this.totalWordsNum = document.querySelector("#totalWordsNum");
    this.vocabularyBox = document.querySelector("#vocabularyBox");
    this.errorVocabularyBox = document.querySelector("#errorVocabularyBox");
    this.errorVocabulary = document.querySelector("#errorVocabulary");
    this.inputWordTxt = document.querySelector("#inputWordTxt");
    this.inputTranslate = document.querySelector("#inputTranslate");
    this.addWordForm = document.querySelector("#addWordForm");

    this.viewWord();

    document.querySelector("#addBtn").addEventListener("click", this.addSaveWord(true, this));
    document.querySelector(".js-edit-btn").addEventListener("click", () => {
      document.querySelector(`#${this.dataset.node}`).style.display = "none";
      document.querySelector(`#${this.dataset.node}Edit`).style.display = "block";
    });
    document.querySelector(".js-save-btn").addEventListener("click", this.addSaveWord);
    document.querySelector(".js-del-btn").addEventListener("click", this.removeWord);
  },

  recountTotal() {
    document.querySelector("#totalWordsNum").innerText = localStorage.key("words").split(",").length;
  },

  removeWord(notReindex) {
    // Remove word from vocabulary
    // const id = self.dataset.id;
    const self = this;
    const node = self.data.node;

    if (!notReindex) {
      // LW.index.splice(id, 1); // Remove from index
      // localStorage.key("words", LW.index.join());
    }
    localStorage.remove(node); // Remove this word
    document.querySelector(`#${node}`).style.display = "none"; // $(`#${node}`).remove();
    document.querySelector(`#${node}Edit`).style.display = "none";// $(`#${node}Edit`).remove();
    this.recountTotal();
    Learn.wordsLearn = [];
    Learn.recountIndexLearn();
    Repeat.wordsRepeat = {
      currentIndexFirst: 0,
      first: [],
      currentIndexSecond: 0,
      second: [],
      currentIndexThird: 0,
      third: [],
    };
    Repeat.recountIndexRepeat();
  },

  viewWord() {
    let contentInner = "";

    const list = localStorage.key("words").split(",");
    list.forEach((node, index) => {
      let txt;
      let translate;
      const item = localStorage.key(node);
      if (item) {
        txt = item.word;
        translate = item.translate;

        this.words.push(txt);
        this.translates.push(translate);
        contentInner = contentInner + this.rowTemplate
          .replace(/{{node}}/g, node)
          .replace(/{{txt}}/g, txt)
          .replace(/{{translate}}/g, translate)
          .replace(/{{index}}/g, index);
      }
    });

    document.querySelector("#vocabularyBox").innerHTML = contentInner;
    this.recountTotal();
  },

  addSaveWord(addWord, self) {
    const wordTxt = (!addWord) ? document.querySelector(`#word-${this.dataset.node}`) : self.inputWordTxt;
    const translate = (!addWord) ? document.querySelector(`#translate-${this.dataset.node}`) : self.inputTranslate;
    const addForm = (!addWord) ? document.querySelector(`#form-${this.dataset.node}`) : self.addWordForm;
    const inputWord = wordTxt.value.trim();
    const inputTranslate = translate.value.trim();
    const form = addForm;
    let error = false;
    let word = {};

    this.clearFields();
    // Check for empty fields
    if (!inputWord) {
      error = this.setFieldError(form.children[0].children[0]);
    } else if (!inputTranslate) {
      error = this.setFieldError(form.children[1].children[0]);
    }
    if (error) { // Show error if any
      this.errorVocabularyBox.classList.remove("nodisplay");
      this.errorVocabulary.innerText = locale[locale.currentLocale].errorEmpty;
    } else { // Otherwise save new word to Vocabulary
      let newIndexVal;
      const todayDate = new Date().valueOf();
      word = {
        index: todayDate,
        word: inputWord,
        translate: inputTranslate,
        step: 0,
        date: 0,
      };

      // save newly added word
      // const newIndexVal = `index${LW.index.length + 1}`;
      localStorage.key(`${newIndexVal}`, word);

      // const contentInner = this.rowTemplate
      // .replace(/{{node}}/g, todayDate)
      // .replace(/{{txt}}/g, inputWord)
      // .replace(/{{translate}}/g, inputTranslate)
      // .replace(/{{index}}/g, (addWord) ? LW.index.length : LW.index.indexOf(inputWord));

      if (addWord) {
        // LW.index.push(newIndexVal);
        wordTxt.value = "";
        translate.value = "";
        this.errorVocabularyBox.classList.remove("nodisplay");
        this.errorVocabulary.innerText(locale[locale.currentLocal].errorNoW);
        // this.vocabularyBox.appendChild(contentInner);
      } else {
        // const id = wordTxt.attr("id").slice(5);

        // LW.index[LW.index.indexOf(id)] = newIndexVal;
        // $(`#${id}`).before(contentInner);
        // this.removeWord($(`#del-${id}`), true);
      }

      // LW.storeItem(`${LW.name}-words`, LW.index.join()); //add word to Vocabulary list
      this.clearFields();
      this.recountTotal();
      Learn.wordsLearn = [];
      Learn.recountIndexLearn();
      Learn.showWord();
    }
  },

  clearFields() {
    document.querySelectorAll(".form-group").forEach((node) => {
      // Clear all error styles
      node.classList.remove("has-error");
    });
    document.querySelector("#errorSettings").classList.add("nodisplay");
  },

  setFieldError(self) { // Set the error style for the current input field
    self.classList.add("has-error");

    return true;
  },
};

export default Vocabulary;
