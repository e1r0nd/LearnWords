import vocabularyTmp from "./Vocabulary.html";
import "./Vocabulary.scss";

import rowTemplate from "../row-word/row-word.html";

import button from "../Button";
import input from "../Input";

import locale from "../../actions/Locale";

import Storage from "browser-lsc-storage";
const storage = Storage.local;
storage.prefix = "LWdb";

import Repeat from "../Repeat";
import Learn from "../Learn";

import Words from "../../actions/Words";

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
    document.querySelector("#totalWordsNum").innerText = storage.key("words").length;
  },

  editWord() {
    document.querySelector(`#${this.dataset.node}`).classList.add("u--nodisplay");
    document.querySelector(`#${this.dataset.node}Edit`).classList.remove("u--nodisplay");
  },

  removeWord() {
    // Remove word from vocabulary
    const wordIndex = this.dataset.node;
    const words = storage.key("words");
    const index = words.findIndex((el) => el.index === wordIndex);

    words.splice(index, 1); // Remove this word
    storage.key("words", words);

    document.querySelector(`#${wordIndex}`).remove();
    document.querySelector(`#${wordIndex}Edit`).remove();

    document.querySelector("#totalWordsNum").innerText = words.length;

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
    const wordsList = storage.key("words");

    wordsList.forEach((item) => {
      contentInner = contentInner + this.rowTemplate
        .replace(/{{node}}/g, item.index)
        .replace(/{{txt}}/g, item.word)
        .replace(/'{{val_txt}}/g, item.word)
        .replace(/{{translate}}/g, item.translate)
        .replace(/'{{val_translate}}/g, item.translate);
    });

    document.querySelector("#vocabularyBox").innerHTML = contentInner;
    this.recountTotal();
  },

  addSaveWord() {
    const addWord = this.addSaveWord;

    const wordTxt = (!addWord) ? document.querySelector(`#word-${this.dataset.node}`) : this.inputWordTxt;
    const translate = (!addWord) ? document.querySelector(`#translate-${this.dataset.node}`) : this.inputTranslate;
    const inputId = (!addWord) ? this.dataset.node : new Date().valueOf();
    const inputWord = wordTxt.value.trim();
    const inputTranslate = translate.value.trim();
    let error = false;
    let word = {};

    // Check for empty fields
    !inputWord && (error = this.setFieldError(wordTxt));
    !inputTranslate && (error = this.setFieldError(translate));
    if (error) { // Show error if any
      this.errorVocabularyBox.classList.remove("u--nodisplay");
      this.errorVocabulary.innerText = locale[locale.currentLocale].errorEmpty;
    } else { // Otherwise save new word to Vocabulary
      word = {
        index: inputId,
        word: inputWord,
        translate: inputTranslate,
        step: 0,
        date: 0,
      };

      // save newly added word
      Words.storeWord(word);

      if (addWord) {
        wordTxt.value = "";
        wordTxt.classList.remove("has-error");
        translate.value = "";
        translate.classList.remove("has-error");
        this.errorVocabularyBox.classList.remove("u--nodisplay");
        this.errorVocabulary.innerText = locale[locale.currentLocale].errorNoW;

        const tmp = document.createElement("div");
        tmp.innerHTML = rowTemplate
          .replace(/{{node}}/g, inputId)
          .replace(/{{txt}}/g, inputWord)
          .replace(/{{translate}}/g, inputTranslate);
        this.vocabularyBox.appendChild(tmp.firstChild);
        this.recountTotal();
      } else {
        document.querySelector(`#wordTxt-${inputId}`).innerText = inputWord;
        document.querySelector(`#translateTxt-${inputId}`).innerText = inputTranslate;
        document.querySelector(`#${this.dataset.node}`).classList.remove("u--nodisplay");
        document.querySelector(`#${this.dataset.node}Edit`).classList.add("u--nodisplay");
      }
      Learn.recountIndexLearn();
    }
  },

  clearFields() {
    document.querySelectorAll(".form-group").forEach((node) => {
      // Clear all error styles
      node.classList.remove("u--haserror");
    });
    document.querySelector("#errorSettings").classList.add("u--nodisplay");
  },

  setFieldError(self) { // Set the error style for the current input field
    self.classList.add("u--haserror");

    return true;
  },
};

export default Vocabulary;
