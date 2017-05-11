import summaryTmp from "./Summary.html";
import "./Summary.scss";

const Summary = {
  createBlock() {
    const html = document.createElement("div");
    html.id = "summary";
    html.classList.add("center");
    html.dataset.toggle = "nav";
    html.innerHTML = summaryTmp;

    return html;
  },
};

export default Summary;
