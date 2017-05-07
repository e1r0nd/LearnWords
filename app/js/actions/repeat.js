/**************************************************
 * Learn Words // repeat.js
 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
 * Placed in public domain.
 **************************************************/
import LWClass from '../utils/LW';
const LW = new LWClass('LWdb');

import SettingsClass from '../../components/Settings';
const Settings = new SettingsClass();

const Repeat = {
  wordsRepeat: {
    first: [],
    second: [],
    third: []
  },

  repeatWordsNum: $('#repeatWordsNum'),
  repeatWordsTopNum: $('#repeatWordsTopNum'),
  repeatWordsTopSNum: $('#repeatWordsTopSNum'),
  checkWord: $('#checkWord'),
  checkWordInp: $('#checkWordInp'),
  enterWord: $('#enterWord'),
  inputWord: $('#inputWord'),
  noWordsRepeat: $('#noWordsRepeat'),
  enterBtn: $('#enterBtn'),

  getToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
  },

  recountIndexRepeat() {
    //count words to Repeat
    if (!Repeat.wordsRepeat.first.length && !Repeat.wordsRepeat.second.length && !Repeat.wordsRepeat.third.length) {
      $(LW.index).each((index, node) => { //the initial counting
        const item = LW.readItem(`${LW.name}-${node}`);
        if (item) {
          if (this.getToday() > item.date) { //if this word is for today
            if (1 === item.step) {
              Repeat.wordsRepeat.first.push(item);
            } else if (2 === item.step) {
              Repeat.wordsRepeat.second.push(item);
            }
            if (3 === item.step) {
              Repeat.wordsRepeat.third.push(item);
            }
          }
        }
      });
    }
    const wordsRepeatTotal = Repeat.wordsRepeat.first.length + Repeat.wordsRepeat.second.length + Repeat.wordsRepeat.third.length;
    const wordsRepeatLength = (wordsRepeatTotal) ? wordsRepeatTotal : '';

    $(repeatWordsNum).text(wordsRepeatLength || '0');
    // $(repeatWordsTopNum).text(wordsRepeatLength);
    // $(repeatWordsTopSNum).text(wordsRepeatLength);
  },

  getWord(index, arrWords) {
    //if index is 0 we get the correct word. The other words are random
    if (0 === index) {
      wordPlaceholder = Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0][(Repeat.wordsRepeat.first.length) ? 'translate' : 'word'];
    } else {
      wordPlaceholder = Vocabulary[(Repeat.wordsRepeat.first.length) ? 'translates' : 'words'][Repeat.getRandomInt(0, Vocabulary[(Repeat.wordsRepeat.first.length) ? 'translates' : 'words'].length - 1)];
    }

    if (arrWords.includes(wordPlaceholder)) {
      Repeat.getWord(index, arrWords);
    }

    return wordPlaceholder;
  },

  showWord() { //show a next word to Repeat
    if (Repeat.wordsRepeat.first.length || Repeat.wordsRepeat.second.length) {
      const id = Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].index;
      let wordPlaceholder = '';
      const arrWords = new Array();
      $(checkWordInp).text(Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0][(Repeat.wordsRepeat.first.length) ? 'word' : 'translate']).data('id', id);

      const arrOptionButtons = $('[data-type=checkWordBtn]');
      //the answer buttons are shuffled so that we don't know which one is the correct word.
      Repeat.shuffle(arrOptionButtons);

      arrOptionButtons.each(function (index) {

        wordPlaceholder = Repeat.getWord(index, arrWords);

        arrWords[index] = wordPlaceholder;

        $(this).text(wordPlaceholder);
      });
      $(enterBtn).data('direction', true);
      $(checkWord).removeClass('nodisplay');
      $(enterWord).addClass('nodisplay');
      $(noWordsRepeat).addClass('nodisplay');
    } else if (Repeat.wordsRepeat.third.length) {
      $(enterWordInp).text(Repeat.wordsRepeat.third[0].translate);
      $(checkWord).addClass('nodisplay');
      $(enterWord).removeClass('nodisplay');
      $(noWordsRepeat).addClass('nodisplay');
    } else {
      $(checkWord).addClass('nodisplay');
      $(enterWord).addClass('nodisplay');
      $(noWordsRepeat).removeClass('nodisplay');
    }
  },

  actionWord(step, reindex) {
    if (step) {

      LW.storeItem(`${LW.name}-${Repeat.wordsRepeat[Repeat.currentIndex].word}`, word); //save word

      if (reindex) {
        Repeat.wordsRepeat.splice(Repeat.currentIndex, 1); //remove from index
        Repeat.recountIndexRepeat();
      } else {
        Repeat.currentIndex++;
      }
    } else {
      Repeat.currentIndex++;
    }

    if (Repeat.currentIndex >= Repeat.wordsRepeat.length) {
      Repeat.currentIndex = 0;
    }
    Repeat.showWord(Repeat.currentIndex);
  },

  checkWord(self) {
    const word = {
      index: Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].index,
      word: Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].word,
      translate: Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].translate,
      step: Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].step,
    };

    if ($(self).text() === ((Repeat.wordsRepeat.first.length) ? word.translate : word.word)) {
      word.step++;
      word.date = this.getToday() + 864000000 * Settings.params[(Repeat.wordsRepeat.first.length) ? 'second' : 'third'];
    } else {
      word.step--;
      word.date = (Repeat.wordsRepeat.first.length) ? 0 : this.getToday() + 864000000 * Settings.params.first;
    }
    LW.storeItem(`${LW.name}-${word.index}`, word); //save word
    Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'].splice(0, 1); //remove from index
    // Learn.wordsLearn = [];
    // Learn.recountIndexLearn();
    // Learn.showWord();
    Repeat.recountIndexRepeat();
    Repeat.showWord();
  },

  repeatWord() {
    const word = {
      index: Repeat.wordsRepeat.third[0].index,
      word: Repeat.wordsRepeat.third[0].word,
      translate: Repeat.wordsRepeat.third[0].translate,
      step: Repeat.wordsRepeat.third[0].step,
    };
    if ($(enterWordInp).val() === word.word) {
      word.step++;
      word.date = 0;
    } else {
      word.step--;
      word.date = this.getToday() + 864000000 * Settings.params.second;
    };
    LW.storeItem(`${LW.name}-${word.index}`, word); //save word
    Repeat.wordsRepeat.third.splice(0, 1); //remove from index
    // Learn.wordsLearn = [];
    // Learn.recountIndexLearn();
    // Learn.showWord();
    Repeat.recountIndexRepeat();
    Repeat.showWord();
  },

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  shuffle(a) {
    let j;
    let x;
    let i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  },

  init() {
    $(document).on('click', '[data-type=checkWordBtn]', function () {
      Repeat.checkWord(this);
    });
    $(document).on('click', '#enterBtn', Repeat.repeatWord);
  }
};

export {Repeat};
