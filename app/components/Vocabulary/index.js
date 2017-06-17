import vocabularyTmp from "./Vocabulary.html";
import "./Vocabulary.scss";

import rowTemplate from "../row-word/row-word.html";

import button from "../Button";
import input from "../Input";

import locale from "../../actions/Locale";

import storage from "browser-lsc-storage";
const localStorage = storage.local;
localStorage.prefix = "LWdb";

import Repeat from "../Repeat";
import Learn from "../Learn";

const Vocabulary = {
  createBlock() {
    const addBtn = button({
      "id": "addBtn",
      "label": "Add",
      "class": "btn btn-primary",
      "dataLang": "addBtn",
    });
    const inputWordTxt = input({
      "id": "inputWordTxt",
      "label": "Word",
      "formClass": "form-group-right",
      "placeholder": "Enter word",
      "dataToggle": "lang",
      "dataLang": "inputWordLbl",
    });
    const inputTranslate = input({
      "id": "inputTranslate",
      "label": "Translate",
      "formClass": "form-group-right",
      "placeholder": "Enter translate",
      "dataToggle": "lang",
      "dataLang": "inputTranslateLbl",
    });

    const html = document.createElement("div");
    html.id = "vocabulary";
    html.classList.add("u--center", "u--nodisplay");
    html.dataset.toggle = "nav";
    html.innerHTML = vocabularyTmp
      .replace(/{{inputWordTxt}}/g, inputWordTxt)
      .replace(/{{inputTranslate}}/g, inputTranslate)
      .replace(/{{addBtn}}/g, addBtn);

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

    document.querySelector("#addBtn").addEventListener("click", this.addSaveWord.bind(this));
    document.querySelectorAll(".js-edit-btn").forEach((node) => {
      node.addEventListener("click", this.editWord);
    });
    document.querySelectorAll(".js-save-btn").forEach((node) => {
      node.addEventListener("click", this.addSaveWord);
    });
    document.querySelectorAll(".js-del-btn").forEach((node) => {
      node.addEventListener("click", this.removeWord);
    });
  },

  recountTotal() {
    document.querySelector("#totalWordsNum").innerText = localStorage.key("words").split(",").length;
  },

  editWord() {
    document.querySelector(`#${this.dataset.node}`).style.display = "none";
    document.querySelector(`#${this.dataset.node}Edit`).style.display = "block";
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
          .replace(/'{{val_txt}}/g, txt)
          .replace(/{{translate}}/g, translate)
          .replace(/'{{val_translate}}/g, translate)
          .replace(/{{index}}/g, index);
      }
    });

    document.querySelector("#vocabularyBox").innerHTML = contentInner;
    this.recountTotal();
  },

  addSaveWord() {
    const addWord = this.addSaveWord;

    const wordTxt = (!addWord) ? document.querySelector(`#word-${this.dataset.node}`) : this.inputWordTxt;
    const translate = (!addWord) ? document.querySelector(`#translate-${this.dataset.node}`) : this.inputTranslate;
    const addForm = (!addWord) ? document.querySelector(`#form-${this.dataset.node}`) : this.addWordForm;
    const inputWord = wordTxt.value.trim();
    const inputTranslate = translate.value.trim();
    // const form = addForm;
    let error = false;
    let word = {};

    // this.clearFields();
    // Check for empty fields
    !inputWord && (error = this.setFieldError(wordTxt));
    !inputTranslate && (error = this.setFieldError(translate));
    if (error) { // Show error if any
      this.errorVocabularyBox.classList.remove("u--nodisplay");
      this.errorVocabulary.innerText = locale[locale.currentLocale].errorEmpty;
    } else { // Otherwise save new word to Vocabulary
      const todayDate = new Date().valueOf();
      word = {
        index: todayDate,
        word: inputWord,
        translate: inputTranslate,
        step: 0,
        date: 0,
      };

      // save newly added word
      const indexLength = localStorage.key("words").split(",").length;
      const newIndexVal = `index${indexLength + 1}`;

      localStorage.key(`${newIndexVal}`, word);

      const contentInner = this.rowTemplate
      .replace(/{{node}}/g, todayDate)
      .replace(/{{txt}}/g, inputWord)
      .replace(/{{translate}}/g, inputTranslate)
      .replace(/{{index}}/g, (addWord) ? indexLength : this.dataset.id);

      if (addWord) {
        const newIndex = localStorage.key('index').split(",").push(newIndexVal).join(",");
        localStorage.key("index", newIndex);
        wordTxt.value = "";
        wordTxt.classList.remove("has-error");
        translate.value = "";
        translate.classList.remove("has-error");
        this.errorVocabularyBox.classList.remove("u--nodisplay");
        this.errorVocabulary.innerText(locale[locale.currentLocale].errorNoW);
        this.vocabularyBox.appendChild(contentInner);
      } else {
        const id = wordTxt.attr("id").slice(5);

        // localStorage.key("index"[LW.index.indexOf(id)] = newIndexVal;
        document.querySelector(`#${id}`).innerHTML = contentInner;
        this.removeWord($(`#del-${id}`), true);
      }

      // localStorage.key("words", LW.index.join()); // add word to Vocabulary list
      // this.clearFields();
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
    document.querySelector("#errorSettings").classList.add("u--nodisplay");
  },

  setFieldError(self) { // Set the error style for the current input field
    self.classList.add("has-error");

    return true;
  },
};

export default Vocabulary;
