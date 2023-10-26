import { addZeroToNegativeNumbers, calc } from "../src/js/calc.js";
import { expect } from "chai";
import { validBraces } from "../src/js/render.js";
const createRandomNumbers = () => {
  const positiveNums = [
    Math.round(Math.random() * 100),
    Math.round(Math.random() * 10),
    Math.round(Math.random() * 1000),
    Math.round(Math.random() * 10000),
  ];
  const negativeNums = [
    -Math.round(Math.random() * 100),
    -Math.round(Math.random() * 10),
    -Math.round(Math.random() * 1000),
    -Math.round(Math.random() * 10000),
  ];
  let randNums = {
    plus: positiveNums,
    minus: negativeNums,
  };
  return randNums;
};

describe("calc", () => {
  it("calc expressions with positive numbers", () => {
    for (let i = 0; i < 100; i++) {
      let obj = createRandomNumbers();
      let expectedResult = `${obj.plus[0]}+${obj.plus[1]}-${obj.plus[2]}`;
      let equalResult = obj.plus[0] + obj.plus[1] - obj.plus[2];
      expect(calc(expectedResult)).equal(equalResult);
    }
  });

  it("calc expressions with negative numbers", () => {
    for (let i = 0; i < 100; i++) {
      let obj = createRandomNumbers();
      let expectedResult = `((${obj.minus[0]})+(${obj.minus[3]}))×(${obj.minus[2]})`;
      let equalResult = (obj.minus[0] + obj.minus[3]) * obj.minus[2];
      expect(calc(expectedResult)).equal(equalResult);
    }
  });

  it("calc expressions with mixed numbers and operations", () => {
    for (let i = 0; i < 100; i++) {
      let obj = createRandomNumbers();
      let expectedResult = `(${obj.plus[0]})×(${obj.minus[1]})÷(-(${obj.minus[2]})-${obj.plus[3]})`;
      let equalResult = (obj.plus[0] * obj.minus[1]) / (-obj.minus[2] - obj.plus[3]);
      expect(calc(expectedResult).toFixed(10)).equal(equalResult.toFixed(10));
    }
  });
});

describe("brackets", () => {
  it("check sum brackets", () => {
    expect(validBraces("()))")).equal(false);
    expect(validBraces("()")).equal(true);
    expect(validBraces(")(")).equal(false);
    expect(validBraces("()()")).equal(true);
    expect(validBraces("(((")).equal(false);
    expect(validBraces(")")).equal(false);
    expect(validBraces("(")).equal(false);
    expect(validBraces("((())())")).equal(true);
  });
});

describe("expressionToRPN", () => {
  it("add 0 to negative numbers", () => {
    expect(addZeroToNegativeNumbers("-2")).equal("0-2");
    expect(addZeroToNegativeNumbers("0")).equal("0");
    expect(addZeroToNegativeNumbers("-2+(-0)")).equal("0-2+(0-0)");
    expect(addZeroToNegativeNumbers("-2+(-1-(-3))")).equal("0-2+(0-1-(0-3))");
    expect(addZeroToNegativeNumbers("-(-10-((-1)-2))")).equal("0-(0-10-((0-1)-2))");
  });
});
