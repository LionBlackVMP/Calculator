import { calc } from "./calc.js";
const btnsArr = ["(", ")", "CE", "×", 7, 8, 9, "÷", 4, 5, 6, "+", 1, 2, 3, "-", 0, "00", ".", "="];
export const inputValue = { str: "", isResult: false };
if (typeof document !== "undefined") {
  const buttons = document.getElementById("btns-container");
  const result = document.querySelector(".result");
  const regexpOperators = /["×","÷","\-","+"]/;

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
    inputValue.str = String(inputValue.str);
    const lastSymbol = inputValue.str[inputValue.str.length - 1];
    if (inputValue.str === "Error") resetCalculator();
    if (isMathSymbol(value)) {
      inputValue.isResult = false;
      handleMathSymbol(value, lastSymbol);
    } else if (value === "CE") {
      deleteLastSymbol();
    } else if (
      (value === ")" && validBraces(inputValue.str, value)) ||
      (value === ")" && lastSymbol === ".")
    ) {
      return;
    } else if (value === "(" && lastSymbol === ".") {
      return;
    } else if (value === "=") {
      handleEquals();
    } else if (value === ".") {
      canPointExist(value, lastSymbol);
    } else {
      if (inputValue.isResult) {
        inputValue.str = value;
      } else {
        inputValue.str += value;
      }

      inputValue.isResult = false;
      result.innerHTML = inputValue.str;
    }
  };

  const canPointExist = (value, lastSymbol) => {
    // control if possible to create a fractional number
    const nums = inputValue.str.split(/["×","÷","\-","+","(",")"]/);
    const stack = ["", "(", ")"];
    const lastNumber = nums[nums.length - 1];
    if (lastNumber.split("").includes(".")) return;
    if (lastSymbol === ")") return;
    if (stack.includes(lastNumber)) return;
    handleMathSymbol(value, lastSymbol);
  };

  const deleteLastSymbol = () => {
    // delete last symbol, if symbol only one change it to 0
    if (inputValue.isResult) return resetCalculator();
    if (inputValue.str.length > 1) {
      inputValue.str = inputValue.str.slice(0, -1);
    } else {
      inputValue.str = "";
    }
    result.innerHTML = inputValue.str;
  };

  const isMathSymbol = (value) => {
    // check if pressed button include math sybmols or point
    if (value.match(regexpOperators)) return true;
  };

  const handleMathSymbol = (value, lastSymbol) => {
    // control if current negative value have right syntax with brackets
    if (inputValue.str === "") return;
    const penultSymbol = inputValue.str[inputValue.str.length - 2];
    if (lastSymbol === ".") return;
    if (lastSymbol === "(") if ((isMathSymbol(value) && value !== "-") || value === ".") return; // after open bracket possible to write only minus
    if (lastSymbol && isMathSymbol(lastSymbol)) {
      if (penultSymbol !== "(") updateMathSymbol(value); // possible to replace math operation
    } else {
      inputValue.str += value;
      result.innerHTML = inputValue.str;
    }
  };

  const updateMathSymbol = (value) => {
    // change math operations
    let arr = inputValue.str.split("");
    arr.splice(-1, 1, value);
    inputValue.str = arr.join("");
    result.innerHTML = inputValue.str;
  };

  const resetCalculator = () => {
    //reset input value
    inputValue.str = "0";
    result.innerHTML = "0";
  };

  const handleEquals = () => {
    // send expression to calculate
    if (inputValue.str === "") inputValue.str = "";
    if (validBraces(inputValue.str, "=")) {
      inputValue.str = calc(inputValue.str);
      result.innerHTML = inputValue.str;
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
