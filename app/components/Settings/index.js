import settingsTmp from "./Settings.html";
import "./Settings.scss";

import button from "../Button";
import input from "../Input";

import storage from "browser-lsc-storage";
const localStorage = storage.local;
localStorage.prefix = "LWdb";
import locale from "../../actions/Locale";

const Settings = {
  createBlock() {
    const firstCheck = input({
      "id": "inputFirstCheck",
      "label": "First",
      "formClass": "form-group-right",
      "placeholder": "Days before the first check",
      "dataToggle": "lang",
      "dataLang": "first",
    });
    const secondCheck = input({
      "id": "inputSecondCheck",
      "label": "Second",
      "formClass": "form-group-right",
      "placeholder": "Days before the second check",
      "dataToggle": "lang",
      "dataLang": "second",
    });
    const thirdCheck = input({
      "id": "inputThirdCheck",
      "label": "Third",
      "formClass": "form-group-right",
      "placeholder": "Days before the third check",
      "dataToggle": "lang",
      "dataLang": "third",
    });
    const saveSettings = button({
      "id": "saveSettings",
      "label": "Save",
      "class": "btn btn-primary",
      "dataLang": "saveBtn",
    });
    const cancelSettings = button({
      "id": "cancelSettings",
      "label": "Cancel",
      "class": "btn btn-default",
      "dataLang": "cancelBtn",
    });

    const options = firstCheck + secondCheck + thirdCheck;
    const buttons = saveSettings + cancelSettings;
    const html = document.createElement("div");
    html.id = "settings";
    html.classList.add("u--center", "u--nodisplay");
    html.dataset.toggle = "nav";
    html.innerHTML = settingsTmp
      .replace(/{{buttons}}/g, buttons)
      .replace(/{{options}}/g, options);

    return html;
  },

  init() {
    this.params = {};
    this.inputFirstCheck = document.querySelector("#inputFirstCheck");
    this.inputSecondCheck = document.querySelector("#inputSecondCheck");
    this.inputThirdCheck = document.querySelector("#inputThirdCheck");
    this.settingFrom = document.querySelector("#settingFrom");
    this.errorSettings = document.querySelector("#errorSettings");
    document.querySelector("#saveSettings").addEventListener("click", this.saveSetting.bind(this));
    document.querySelector("#cancelSettings").addEventListener("click", this.cancelSetting.bind(this));

    const settings = this.getSettings();

    this.inputFirstCheck.value = settings.first;
    this.inputSecondCheck.value = settings.second;
    this.inputThirdCheck.value = settings.third;

    this.params = settings; // Store locale
  },

  saveSetting() {
    // Save setting's values to DB
    const first = this.inputFirstCheck.value.trim();
    const second = this.inputSecondCheck.value.trim();
    const third = this.inputThirdCheck.value.trim();
    const settings = {
      first,
      second,
      third,
    };
    let errorName = "";
    let error = false;

    this.clearFields();
    // Check for empty fields
    if (!first) {
      error = this.setFieldError(this.inputFirstCheck);
      errorName = "empty";
    } else if (!second) {
      error = this.setFieldError(this.inputSecondCheck);
      errorName = "empty";
    } else if (!third) {
      error = this.setFieldError(this.inputThirdCheck);
      errorName = "empty";
    } else { // only digits is valid
      if (!this.isNumber(first)) {
        error = this.setFieldError(this.inputFirstCheck);
        errorName = "number";
      }
      if (!this.isNumber(second)) {
        error = this.setFieldError(this.inputSecondCheck);
        errorName = "number";
      }
      if (!this.isNumber(third)) {
        error = this.setFieldError(this.inputThirdCheck);
        errorName = "number";
      }
    }
    if (error) { // Show error if any
      const errorTxt = ("empty" === errorName)
        ? locale[locale.currentlocale].errorEmpty
        : locale[locale.currentlocale].errorValid;
      this.errorSettings.classList.remove("nodisplay");
      this.errorSettings.innerText = errorTxt;
    } else { // Otherwise save new settings
      this.putSettings(settings);
      this.errorSettings.classList.remove("nodisplay");
      this.errorSettings.innerText = locale[locale.currentLocale].errorNo;

      this.params = settings; // Store locale
    }

    return false;
  },

  cancelSetting() {
    const settings = this.getSettings();

    this.inputFirstCheck.value = settings.first;
    this.inputSecondCheck.value = settings.second;
    this.inputThirdCheck.value = settings.third;
    this.clearFields();

    return false;
  },

  isNumber(str, withDot) {
    // Validate filed for number value
    const NumberReg = /^\d+$/;
    const NumberWithDotReg = /^[-+]?[0-9]*\.?[0-9]+$/;

    return withDot ? NumberWithDotReg.test(str) : NumberReg.test(str);
  },

  clearFields() {
    // Clear all error styles
    document.querySelectorAll(".form-group").forEach((node) => {
      node.classList.remove("has-error");
    });
    document.querySelector("#errorSettings").classList.add("nodisplay");
  },

  setFieldError(self) {
    // Set the error style for the current input field
    self.classList.add("has-error");

    return true;
  },

  getSettings() {
    // Read settings values
    let settings = localStorage.key("settings");
    if (!settings) {
      console.log("initialize settings");
      settings = {
        first: 1,
        second: 3,
        third: 7,
      };
      localStorage.key("settings", settings);
      localStorage.key("language", "en_GB");
    }

    return settings;
  },

  putSettings(theSettingsObj) {
    localStorage.key("settings", theSettingsObj);
  },
};

export default Settings;
