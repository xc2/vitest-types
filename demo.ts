import { expect, test } from "vitest-demo";

test("test", () => {
  expect("a").toMatchSnapshot();
});
