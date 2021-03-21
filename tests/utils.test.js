import utils from "../lib/utils";

test("find files ending .md", () => {
  expect(utils.findFilesWithEnding(".", ".md")).toEqual(["README.md"]);
});

test("find files ending .exe", () => {
    expect(utils.findFilesWithEnding(".", ".exe")).toEqual([]);
  });

test("generate random number that is unequal to the last", () => {

});


const maxValue = 100;
function numberGenerator() {
  let output = []
  for (let i = 0; i < 500; i++) {
    output.push(Math.floor(Math.random() * maxValue));    
  }
  return output
}

test.each(numberGenerator())('%i should not be equal the last number', (n) => {
  expect(utils.getRandomNumber(maxValue, n)).not.toBe(n);
});
