import buttonTmp from "./Button.html";
import "./Button.scss";

const Button = (props) => {
  props = props || {};

  return buttonTmp
    .replace(/{{id}}/g, `"${props.id}"` || "")
    .replace(/{{label}}/g, props.label || "")
    .replace(/{{class}}/g, `"${props.class}"` || "")
    .replace(/{{dataLang}}/g, `"${props.dataLang}"` || "");
};

export default Button;
