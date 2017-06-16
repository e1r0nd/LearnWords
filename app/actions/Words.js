import Storage from "browser-lsc-storage";
const storage = Storage.local;
storage.prefix = "LWdb";

const Words = {
  loadWords(theWords) {
    let i = 0;
    const arrayOfKeys = [];
    // const storeEachElement = ;

    theWords.forEach((element, i) => {
      // i = i + 1;
      element.index = `index${i + 1}`;
      // element.step =
      element.date = 0;
      storage.key(element.index, element);
      arrayOfKeys.push(element.index);
    });

    storage.key("words", arrayOfKeys.join());
    this.index = arrayOfKeys;

    console.log(`${arrayOfKeys.length} words have been loaded`);
  },

  dumpWords() {
    let key;
    let strValue;
    const result = [];

    const prefixForNumber = `${this.name}-index`;

    // go through all keys starting with the name
    // of the database, i.e 'learnWords-index14'
    // collect the matching objects into arr
    for (let i = 0; i < localStorage.length; i = i + 1) {
      key = localStorage.key(i);
      strValue = localStorage.getItem(key);

      if (0 === key.lastIndexOf(prefixForNumber, 0)) {
        result.push(JSON.parse(strValue));
      }
    }

    // Dump the array as JSON code (for select all / copy)
    console.log(JSON.stringify(result));
  },

  removeObjects(aKeyPrefix) {
    let key;
    const keysToDelete = [];

    // go through all keys starting with the name
    // of the database, i.e 'learnWords-index14'
    for (let i = 0; i < localStorage.length; i = i + 1) {
      key = localStorage.key(i);
      if (0 === key.lastIndexOf(aKeyPrefix, 0)) {
        keysToDelete.push(key);
      }
    }
    // now we have all the keys which should be deleted
    // in the array keysToDelete.
    console.log(keysToDelete);
    keysToDelete.forEach(aKey => {
      storage.remove(aKey);
    });
  },

  removeWords() {
    const aKeyPrefix = `${storage.prefix}-index`;

    this.removeObjects(aKeyPrefix);
    // reset index
    storage.key("words", "");
    // this one triggers that memorystore is executed
    storage.remove("settings");
  },

  destroy() {
    const aKeyPrefix = this.name;

    this.removeObjects(aKeyPrefix);
  },
};

export default Words;
