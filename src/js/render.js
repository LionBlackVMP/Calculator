import { calc } from "./calc.js";

const btnsArr = ["(", ")", "C", "×", 7, 8, 9, "÷", 4, 5, 6, "+", 1, 2, 3, "-", 0, "00", ".", "="];
const obj = { str: "", isResult: false };

if (!typeof document) {
  const buttons = document.getElementById("btns-container");
  const result = document.querySelector(".result");

  btnsArr.forEach((el) => {
    // render all buttons on page
    let button = document.createElement("button");
    button.className = "btn";
    if (!isNaN(el) || el === ".") button.className = "btn btn-num";
    if (el === "=") button.className = "btn btn-result";
    button.innerHTML = el;
    buttons.append(button);
  });

  buttons.addEventListener("click", (e) => {
    handleButtonClick(e);
  });

  const handleButtonClick = (e) => {
    // depend on condition make a action
    if (!e.target.classList.contains("btn")) return;
    let value = e.target.innerHTML;
    isResult(value);
    if (isMathSymbol(value)) {
      handleMathSymbol(value);
    } else if (value === "C") {
      resetCalculator();
    } else if (value === ")" && !validBraces(obj.str, value)) {
      return;
    } else if (value === "=") {
      handleEquals();
    } else {
      obj.str += value;
      result.innerHTML = obj.str;
    }
  };

  const isResult = (value) => {
    // keep result if was pressed button with math operations
    if (obj.isResult === true && !isMathSymbol(value)) {
      resetCalculator();
    }
    obj.isResult = false;
  };

  const isMathSymbol = (value) => {
    // check if pressed button include math sybmols or point
    if (value.match(/["×","÷","\-","+","\."]/)) return true;
  };

  const handleMathSymbol = (value) => {
    // control if current negative value have right syntax with brackets
    if (obj.str === "") return;
    const lastSymbol = obj.str[obj.str.length - 1];
    const penultSymbol = obj.str[obj.str.length - 2];
    if (lastSymbol === "(" && isMathSymbol(value) && value !== "-") return; // after open bracket possible to write only minus
    if (lastSymbol && isMathSymbol(lastSymbol)) {
      if (penultSymbol !== "(") updateMathSymbol(value); // possible to replace math operation
    } else {
      obj.str += value;
      result.innerHTML = obj.str;
    }
  };

  const updateMathSymbol = (value) => {
    // change math operations
    let arr = obj.str.split("");
    arr.splice(-1, 1, value);
    obj.str = arr.join("");
    result.innerHTML = obj.str;
  };

  const resetCalculator = () => {
    //reset input value
    obj.str = "";
    result.innerHTML = "";
  };

  const handleEquals = () => {
    // send expression to calculate
    obj.isResult = true;
    if (obj.str === "") obj.str = "0";
    if (validBraces(obj.str, "=")) {
      obj.str = calc(obj.str);
      result.innerHTML = obj.str;
    }
  };
}
export const validBraces = (braces, value) => {
  // check sum and position open and closed brackets
  let char = braces + value;
  const brackets = { "(": ")" };
  const stack = [];
  const openBrakets = char.match(/[(]/g);
  const closeBrakets = char.match(/[)]/g);
  // forbidden create more closed brakets than open
  if (value !== "=") {
    if (openBrakets) if (openBrakets.length > closeBrakets.length) return true;
  }
  char = char.match(/[()]/g);
  if (!char) return true;
  for (let i = 0; i < char.length; i++) {
    if (brackets[char[i]]) {
      // add all open brackets to stack
      stack.push(char[i]);
    } else {
      // compare quantity of closed brakets with open brakets
      if (char[i] !== brackets[stack.pop()]) {
        return false;
      }
    }
  }
  return stack.length === 0;
};
