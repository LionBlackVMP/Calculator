const btns = document.getElementById("btns-arr");
const result = document.querySelector(".result");
const buttons = ["(", ")", "C", "+", 7, 8, 9, "÷", 4, 5, 6, "×", 1, 2, 3, "-", 0, "00", ".", "="];
const operators = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "×": (x, y) => x * y,
  "÷": (x, y) => x / y,
};
let str = "";
// render all buttons on page
buttons.forEach((el) => {
  let button = document.createElement("button");
  button.className = "btn";
  if (!isNaN(el) || el === ".") button.className = "btn btn-num";
  if (el === "=") button.className = "btn btn-result";
  button.innerHTML = el;
  btns.append(button);
});

// result.addEventListener("contextmenu", function (e) {
//   e.preventDefault(); // Preventing the context menu from appearing
// });
// result.addEventListener("keydown", (e) => {
//   console.log(e.keyCode); // displaying the code of the character pressed from the keyboard
// });

btns.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn")) return;
  let value = e.target.innerHTML;
  let numbers = value.match(/\d/);
  if (value.match(/["×","÷","\-","+"]/)) {
    // check for the input value of math symbols
    const previosSign = str[str.length - 2];
    if (previosSign && previosSign.match(/["×","÷","\-","+"]/)) {
      // check if math symbols repeats and return new one
      let arr = str.split("");
      arr.splice(-2, 1, value);
      str = arr.join("");
      return (result.innerHTML = str);
    }
    value = ` ${value} `;
  }
  if (value === "C") {
    str = "";
    value = "";
  }
  if (value === ")" && !validBraces(str, value)) return;
  if (value === "=") {
    if (validBraces(str, value)) {
      result.innerHTML = calc(str);
      str = "";
      value = "";
      return;
    }
    value = "";
  }
  str += value;
  result.innerHTML = str;
});

function validBraces(braces, value) {
  // check sum and position open and closed brackets
  let char = braces + value;
  const brackets = { "(": ")" };
  const stack = [];
  const openBrakets = char.match(/[(]/g);
  const closeBrakets = char.match(/[)]/g);
  if (value !== "=") {
    if (openBrakets) if (openBrakets.length > closeBrakets.length) return true;
  }
  char = char.match(/[()]/g);
  if (!char) return true;
  for (let i = 0; i < char.length; i++) {
    if (brackets[char[i]]) {
      stack.push(char[i]);
    } else {
      if (char[i] !== brackets[stack.pop()]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}

const calc = (value) => {
  return +RPNtoAnswer(expressionToRPN(value)).toFixed(10);
};

//  write the expression in RPN (Reverse Polish Notation)
const expressionToRPN = (value) => {
  value = value.split(" ").join("");
  const stack = [];
  let current = "";
  let priority;
  for (let i = 0; i < value.length; i++) {
    // checked value priority and return it in stack/str
    priority = getP(value[i]);
    if (priority === 0) current += value[i];
    if (priority === 1) {
      stack.push(value[i]);
    }
    if (priority > 1) {
      // если элементы в стеке имеют высший приоритет, чем текущий, выписываем их в результат
      //   if element in stack have higher priority, than actual, take and put it in str
      stack.forEach((el) => {
        if (getP(stack[stack.length - 1]) >= priority) {
          current += " ";
          current += stack.pop();
        }
      });
      current += " ";
      stack.push(value[i]);
    }
    if (priority === -1) {
      // take all elements till open braket and put it in str
      // вытаскиваем все элементы из стека до открывающией скобки и записываем в результат
      current += " ";
      for (; getP(stack[stack.length - 1]) != 1; ) {
        current += stack.pop();
      }

      stack.pop();
    }
  }
  for (; stack.length > 0; ) {
    // write all remaining elements on the stack to the result
    current += ` ${stack.pop()}`;
  }
  return current;
};

const RPNtoAnswer = (expr) => {
  // make math operations with RPN
  const stack = [];
  expr = expr.split(" ");
  expr.forEach((token) => {
    if (token in operators) {
      let [y, x] = [stack.pop(), stack.pop()];
      stack.push(operators[token](x, y));
    } else {
      stack.push(parseFloat(token));
    }
  });

  return stack.pop();
};
const getP = (token) => {
  // return math symbol priority
  switch (token) {
    case "×":
    case "÷":
      return 3;
    case "-":
    case "+":
      return 2;
    case "(":
      return 1;
    case ")":
      return -1;
    default:
      return 0;
  }
};
