
document.querySelectorAll("a[href]").forEach(element => {
  element.classList.add("colorify");
});

const style = document.createElement("style");
style.innerText = `
  .colorify {
    color: black!important;
    background-color: orange!important;
  }
`;

document.head.appendChild(style);

