export type {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  onTestFailed,
  onTestFinished,
  suite,
  test,
} from "vitest218";
export { TestContext, TaskMeta, File, TaskBase, TaskResult } from "@vitest/runner";
export { MatcherState, ExpectStatic, Assertion } from "@vitest/expect";
export { stringify } from "@vitest/utils";

export interface ExpectPollOptions {
  interval?: number;
  timeout?: number;
  message?: string;
}
export interface SnapshotMatcher<T> {
  <
    U extends {
      [P in keyof T]: any;
    },
  >(
    snapshot: Partial<U>,
    message?: string
  ): void;
  (message?: string): void;
}
export interface InlineSnapshotMatcher<T> {
  <
    U extends {
      [P in keyof T]: any;
    },
  >(
    properties: Partial<U>,
    snapshot?: string,
    message?: string
  ): void;
  (message?: string): void;
}
