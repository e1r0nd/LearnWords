/**
 * @file Learn Words by Leitner system
 * @copyright Anatol Marezhanyi 2017
 * @version 2.0.0-aplha
 */
import "./css/styles.scss";
import "jquery";

import Storage from "browser-lsc-storage";
const storage = Storage.local;
storage.prefix = "LWdb";

/* Create Main container for all components */
const Main = document.createElement("div");
Main.className = "container";

/* Import all components and inject into Main container */
import NavigationClass from "./components/Navigation";
const Navigation = new NavigationClass();
Main.appendChild(Navigation.createBlock());

import LearnClass from "./components/Learn";
const Learn = new LearnClass();
Main.appendChild(Learn.createBlock());

import RepeatClass from "./components/Repeat";
const Repeat = new RepeatClass();
Main.appendChild(Repeat.createBlock());

import VocabularyClass from "./components/Vocabulary";
const Vocabulary = new VocabularyClass();
Main.appendChild(Vocabulary.createBlock());

import SettingsClass from "./components/Settings";
const Settings = new SettingsClass();
Main.appendChild(Settings.createBlock());

/* *** */

import { Memorystore } from "./actions/Memorystore";
// load the default words set if needed
if (storage.isOK && storage.isEmpty) {
  console.log("memorystore: start loading words");
  storage.loadWords(Memorystore);
  console.log("memorystore: words have been loaded");
}

/* Generate the Page */

import { locale } from "./actions/Locale";

import Footer from "./components/Footer";
Main.appendChild(Footer);

/* Create a document after all */
document.querySelector("body").appendChild(Main);

// Init, add event listeners
locale.init();

Navigation.init();

Learn.init();
Learn.recountIndexLearn();
Learn.showWord();

Repeat.init();
Repeat.recountIndexRepeat();
Repeat.showWord();

Vocabulary.viewWord();
Vocabulary.init();

Settings.init();
