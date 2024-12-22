import { expect, test } from "vitest";

test("test", () => {
  expect("a").toMatchSnapshot();
});

it("a", () => {});
