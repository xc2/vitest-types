import chai_2 from "chai";
import {
  Assertion,
  ExpectStatic,
  File,
  RunnerTaskBase,
  RunnerTaskResult,
  RunnerTestFile,
  TaskBase,
  TaskMeta,
  TaskResult,
  TestContext,
  chai,
  expect,
  test,
} from "vitest";
type TaskBaseCase =
  | RunnerTaskBase["logs"]
  | RunnerTaskBase["id"]
  | TaskBase["logs"]
  | TaskBase["id"];
type TaskResultCase =
  | RunnerTaskResult["benchmark"]
  | RunnerTaskResult["state"]
  | TaskResult["benchmark"]
  | TaskResult["state"];

type FileCase =
  | RunnerTestFile["environmentLoad"]
  | RunnerTestFile["filepath"]
  | File["environmentLoad"]
  | File["filepath"];

type TaskMetaCase = TaskMeta["benchmark"];

type TaskContextCase = TestContext["expect"]["anything"] | TestContext["expect"]["unreachable"];

type ExpectStaticCase = ExpectStatic["anything"] | ExpectStatic["unreachable"];

type AssertionCase = Assertion["matchSnapshot"] | Assertion["toMatchFileSnapshot"];

test("test", () => {
  expect("a").toMatchSnapshot();
});

it("chai", () => {
  chai_2.assert.containSubset(1, 2);
  chai_2.assert.equal(1, 2);
  chai.assert.containSubset(1, 2);
  chai.assert.equal(1, 2);
});
