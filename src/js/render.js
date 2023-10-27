import { calc } from "./calc.js";
const btnsArr = ["(", ")", "CE", "×", 7, 8, 9, "÷", 4, 5, 6, "+", 1, 2, 3, "-", 0, "00", ".", "="];
const obj = { str: "", isResult: false };

if (typeof document !== "undefined") {
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
    const value = e.target.innerHTML;
    obj.str = String(obj.str);
    if (obj.str === "Error") resetCalculator();
    if (isMathSymbol(value)) {
      obj.isResult = false;
      handleMathSymbol(value);
    } else if (value === "CE") {
      deleteLastSymbol();
    } else if (value === ")" && validBraces(obj.str, value)) {
      return;
    } else if (value === "=") {
      handleEquals();
    } else {
      if (obj.isResult) {
        obj.str = value;
      } else {
        obj.str += value;
      }
      obj.isResult = false;
      result.innerHTML = obj.str;
    }
  };

  const deleteLastSymbol = () => {
    // delete last symbol, if symbol only one change it to 0
    if (obj.isResult) return resetCalculator();
    if (obj.str.length > 1) {
      obj.str = obj.str.slice(0, -1);
    } else {
      obj.str = "";
    }
    result.innerHTML = obj.str;
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
    obj.str = "0";
    result.innerHTML = "0";
  };

  const handleEquals = () => {
    // send expression to calculate
    obj.isResult = true;
    if (obj.str === "") obj.str = "";
    if (validBraces(obj.str, "=")) {
      obj.str = calc(obj.str);
      result.innerHTML = obj.str;
    }
  };
}

const isBothTypeofBracExist = (braces, value) => {
  // check sum and position open and closed brackets
  if (!braces) return true;
  const openBrackets = braces.match(/[(]/g);
  const closeBrackets = braces.match(/[)]/g);
  const arr = [openBrackets, closeBrackets];
  if (value !== "=") {
    // forbidden create more closed Brackets than open
    if (arr.openBrackets && arr.closeBrackets)
      if (arr.openBrackets.length > arr.closeBrackets.length) return true;
  }
};

export const validBraces = (braces, value) => {
  const brackets = { "(": ")" };
  const stack = [];
  isBothTypeofBracExist(braces, value);
  let char = braces.match(/[()]/g);
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
