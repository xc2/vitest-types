import { expect, test, vi, vitest } from "vitest";

test("test", () => {
  expect("a").toMatchSnapshot();
});

it("a", () => {
  const fn = vi.fn();
  vitest.stubEnv("NODE_ENV", "development");
});
