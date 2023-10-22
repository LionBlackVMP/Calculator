const { calc } = require("../src/js/calc");
const expect = require("chai").expect;

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

describe("test with function calc", () => {
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
