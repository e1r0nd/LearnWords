import badgeTmp from "./Badge.html";
import "./Badge.scss";

const badge = (props) => {
  props = props || {};

  return badgeTmp
    .replace(/{{id}}/g, `"${props.id}"` || "")
    .replace(/{{label}}/g, props.label || "")
    .replace(/{{class}}/g, `"${props.class}"` || "badge--primary");
};

export default badge;
