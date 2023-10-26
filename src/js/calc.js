const operators = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "×": (x, y) => x * y,
  "÷": (x, y) => x / y,
  "(": "(",
  ")": ")",
};

export const calc = (value) => {
  // return answer
  const result = RPNtoAnswer(expressionToRPN(value));
  if (result || result === 0) {
    return +result.toFixed(10);
  }
  return "Error";
};

const isOperatorOutOfBrackets = (value) => {
  // if before open bracket and after close bracket is not any math symbol
  // add multiplication
  value = value.split("");
  const stack = [];
  for (let i = 0; i < value.length; i++) {
    if (!operators[value[i - 1]]) if (value[i] === "(" && value[i - 1]) stack.push("×");
    stack.push(value[i]);
    if (!operators[value[i + 1]]) if (value[i] === ")" && i + 1 !== value.length) stack.push("×");
  }
  return stack.join("");
};

export const addZeroToNegativeNumbers = (value) => {
  // check if first number or number after open braket is negative and add 0 before
  value = value.split("");
  let stack = [];
  if (value[0] === "-") stack.push("0");
  for (let k = 0; k < value.length; k++) {
    if (value[k] === "-" && value[k - 1] === "(") stack.push("0");
    stack.push(value[k]);
  }
  return stack.join("");
};

const expressionToRPN = (value) => {
  //  write the expression in RPN (Reverse Polish Notation)
  value = addZeroToNegativeNumbers(isOperatorOutOfBrackets(value));
  const stack = [];
  let current = "";
  let priority;
  for (let i = 0; i < value.length; i++) {
    // checked value priority and return it in stack/str
    priority = getMathPriority(value[i]);
    switch (priority) {
      case 0:
        current += value[i];
        break;
      case 1:
        stack.push(value[i]);
        break;
      case 2:
      case 3:
        //   if element in stack have higher priority, than actual, take and put it in str
        stack.forEach((el) => {
          if (getMathPriority(stack[stack.length - 1]) >= priority) {
            current += " ";
            current += stack.pop();
          }
        });
        current += " ";
        stack.push(value[i]);
        break;
      case -1:
        // take all elements till open braket and put it in str
        current += " ";
        stack.forEach((el) => {
          if (getMathPriority(stack[stack.length - 1]) != 1) current += `${stack.pop()} `;
        });
        stack.pop();
        break;
    }
  }
  stack.reverse().forEach((el) => {
    // write all remaining elements on the stack to the result
    current += ` ${el}`;
  });
  return current;
};

const RPNtoAnswer = (expr) => {
  // make math operations with RPN
  const arrRPN = [];
  const stack = [];
  expr = expr.split(" ").forEach((el) => {
    if (el) arrRPN.push(el);
  });
  arrRPN.forEach((token) => {
    if (token in operators) {
      // take 2 last numbers in stack and make math operation and put result back in stack
      let [y, x] = [stack.pop(), stack.pop()];
      stack.push(operators[token](x, y));
    } else {
      // put in stack numbers
      stack.push(parseFloat(token));
    }
  });
  return stack.pop();
};

const getMathPriority = (token) => {
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
