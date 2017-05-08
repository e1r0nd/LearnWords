/**************************************************
 * Learn Words // vocabulary.js
 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
 * Placed in public domain.
 **************************************************/
import LWClass from '../utils/LW';
const LW = new LWClass('LWdb');
// import {Learn} from './learn';
// import {Repeat} from './repeat';

import rowTemplate from '../../components/row-word/row-word.html';

const Vocabulary = {
  rowTemplate: rowTemplate,

  totalWordsNum: $('#totalWordsNum'),
  vocabularyBox: $('#vocabularyBox'),
  errorVocabularyBox: $('#errorVocabularyBox'),
  errorVocabulary: $('#errorVocabulary'),
  inputWordTxt: $('#inputWordTxt'),
  inputTranslate: $('#inputTranslate'),
  addWordForm: $('#addWordForm'),

  words: [],
  translates: [],

  recountTotal() {
    $(Vocabulary.totalWordsNum).text(LW.index.length);
  },

  removeWord(self, notReindex) {
    //remove word from vocabulary
    const id = $(self).data('id');

    const node = $(self).data('node');

    if (!notReindex) {
      LW.index.splice(id, 1); //remove from index
      LW.storeItem(`${LW.name}-words`, LW.index.join());
    }
    LW.removeItem(`${LW.name}-${node}`); //remove this word
    $(`#${node}`).remove();
    $(`#${node}Edit`).remove();
    Vocabulary.recountTotal();
    // Learn.wordsLearn = [];
    // Learn.recountIndexLearn();
    Repeat.wordsRepeat = {
      currentIndexFirst: 0,
      first: [],
      currentIndexSecond: 0,
      second: [],
      currentIndexThird: 0,
      third: []
    };
    Repeat.recountIndexRepeat();
  },

  viewWord() {
    let contentInner = '';

    $(LW.index).each((index, node) => {
      let txt;
      let translate;
      const item = LW.readItem(`${LW.name}-${node}`);
      if (item) {
        txt = item.word;
        translate = item.translate;

        Vocabulary.words.push(txt);
        Vocabulary.translates.push(translate);
        contentInner += Vocabulary.rowTemplate.replace(/{{node}}/g, node).replace(/{{txt}}/g, txt).replace(/{{translate}}/g, translate).replace(/{{index}}/g, index);
      }
    });

    $(Vocabulary.vocabularyBox).html(contentInner);
    Vocabulary.recountTotal();
  },

  addSaveWord(wordTxt, translate, addForm, addWord) {
    const inputWord = wordTxt.val().trim();
    const inputTranslate = translate.val().trim();
    const form = addForm;
    let error = false;
    let word = {};

    Vocabulary.clearFields();
    //check for empty fields
    if (!inputWord) {
      error = Vocabulary.setFieldError(form.children(':nth-child(1)').children(':nth-child(1)'));
    } else if (!inputTranslate) {
      error = Vocabulary.setFieldError(form.children(':nth-child(2)').children(':nth-child(1)'));
    }
    if (error) { //show error if any
      $(Vocabulary.errorVocabularyBox).removeClass('nodisplay');
      $(Vocabulary.errorVocabulary).text(local[local.currentLocal].errorEmpty);
    } else { //otherwise save new word to Vocabulary
      let newIndexVal;
      const todayDate = new Date().valueOf();
      word = {
        index: todayDate,
        word: inputWord,
        translate: inputTranslate,
        step: 0,
        date: 0
      };

      // save newly added word
      newIndexVal = `index${LW.index.length + 1}`;
      LW.storeItem(`${LW.name}-${newIndexVal}`, word);

      const contentInner = Vocabulary.rowTemplate.replace(/{{node}}/g, todayDate).replace(/{{txt}}/g, inputWord).replace(/{{translate}}/g, inputTranslate).replace(/{{index}}/g, (addWord) ? LW.index.length : LW.index.indexOf(inputWord));

      if (addWord) {
        LW.index.push(newIndexVal);
        wordTxt.val('');
        translate.val('');
        $(Vocabulary.errorVocabularyBox).removeClass('nodisplay');
        $(Vocabulary.errorVocabulary).text(local[local.currentLocal].errorNoW);
        $(Vocabulary.vocabularyBox).append(contentInner);
      } else {
        const id = wordTxt.attr('id').slice(5);

        LW.index[LW.index.indexOf(id)] = newIndexVal;
        $(`#${id}`).before(contentInner);
        Vocabulary.removeWord($(`#del-${id}`), true);
      }

      LW.storeItem(`${LW.name}-words`, LW.index.join()); //add word to Vocabulary list
      Vocabulary.clearFields();
      Vocabulary.recountTotal();
      // Learn.wordsLearn = [];
      // Learn.recountIndexLearn();
      // Learn.showWord();
    }
  },

  clearFields() {
    $('.form-group').each((i, node) => { //clear all error styles
      $(node).removeClass('has-error');
    });
    $('#errorSettings').addClass('nodisplay');
  },

  setFieldError(self) { //set the error style for the current input field
    $(self).addClass('has-error');
    return true;
  },

  init() {
    $(document).on('click', '#addBtn', () => {
      Vocabulary.addSaveWord($(Vocabulary.inputWordTxt), $(Vocabulary.inputTranslate), $(Vocabulary.addWordForm), true);
    });
    $(document).on('click', '.js-edit-btn', function () {
      $(`#${$(this).data('node')}`).hide();
      $(`#${$(this).data('node')}Edit`).show();
    });
    $(document).on('click', '.js-save-btn', function () {
      Vocabulary.addSaveWord($(`#word-${$(this).data('node')}`), $(`#translate-${$(this).data('node')}`), $(`#form-${$(this).data('node')}`));
    });
    $(document).on('click', '.js-del-btn', function () {
      Vocabulary.removeWord(this);
    });
  }
};

export {Vocabulary};
