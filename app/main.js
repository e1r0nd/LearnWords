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

import SettingsClass from "./components/settings";
const Settings = new SettingsClass();
Main.appendChild(Settings.createBlock());

/* *** */

import { Memorystore } from "./js/utils/memorystore";
// load the default words set if needed
if (storage.isOK && storage.isEmpty) {
  console.log("memorystore: start loading words");
  storage.loadWords(Memorystore);
  console.log("memorystore: words have been loaded");
}

import { Vocabulary } from "./js/actions/vocabulary";
Vocabulary.init();
Vocabulary.viewWord();

import { Repeat } from "./js/actions/repeat";
Repeat.init();
Repeat.recountIndexRepeat();
Repeat.showWord();

/* Generate the Page */

import { locale } from "./actions/Locale";

import Footer from "./components/Footer";
Main.appendChild(Footer);

/* Create a document after all */
document.querySelector("body").appendChild(Main);

// Init, add event listeners
Navigation.init();

Learn.init();
Learn.recountIndexLearn();
Learn.showWord();

Settings.init();
locale.init();
