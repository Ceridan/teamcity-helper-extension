
document.querySelectorAll("a[href]").forEach(element => {
  element.classList.add("colorify");
});

const style: HTMLStyleElement = document.createElement("style");
style.innerText = `
  .colorify {
    color: black!important;
    background-color: green!important;
  }
`;

document.head.appendChild(style);

