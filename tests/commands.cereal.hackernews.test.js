import { getNewsStories, execute } from "../lib/commands/cereal/hackernews";

it("should be true", async () => {
  const result = await getNewsStories([11, 12]);
  expect(result).toBeTruthy();
  expect(result).toBeInstanceOf(Object);
});

it("should be true", async () => {
  const numberOfNews = 2;
  const result = await execute(new String("hackernews"), [numberOfNews]);
  expect(result).toBeTruthy();
  expect(result).toBeInstanceOf(Object);
  expect(result.length).toBe(numberOfNews);
});

it("should reset to 10 posts max", async () => {
  const numberOfNews = 100;
  const result = await execute(new String("hackernews"), [numberOfNews]);
  expect(result).toBeTruthy();
  expect(result).toBeInstanceOf(Object);
  expect(result.length).toBe(10);
});

it("shouldn't post anything", async () => {
  const numberOfNews = 0;
  const result = await execute(new String("hackernews"), [numberOfNews]);
  expect(result).toBeTruthy();
  expect(result).toBeInstanceOf(Object);
  expect(result.length).toBe(0);
});

it("should post 5 news by default", async () => {
  const result = await execute(new String("hackernews"), []);
  expect(result).toBeTruthy();
  expect(result).toBeInstanceOf(Object);
  expect(result.length).toBe(5);
});

it("should post 5 news by default", async () => {
  const result = await execute(new String("hackernews"));
  expect(result).toBeTruthy();
  expect(result).toBeInstanceOf(Object);
  expect(result.length).toBe(5);
});
