import { cpSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import * as Path from "node:path";
import {
  Extractor,
  ExtractorConfig,
  ExtractorLogLevel,
  type ExtractorResult,
  type IConfigFile,
  type IExtractorMessagesConfig,
} from "@microsoft/api-extractor";
import { cloneDeep, defaultsDeep } from "lodash-es";

const rootRequire = createRequire(import.meta.url);
const MODULE_NAME_LI = JSON.stringify("vitest");

const configs = [
  {
    name: "2",
    module: "vitest2",
  },
  {
    name: "3",
    module: "vitest3",
  },
];

for (const c of configs) {
  const srcDir = `./src/${c.name}`;
  const distDir = `./dist/${c.name}`;
  bundle({
    entry: `${srcDir}/vitest.d.ts`,
    output: `${distDir}/vitest.d.ts`,
    bundledPackages: [
      "vitest",
      "@vitest/expect",
      "@vitest/runner",
      "@vitest/utils",
      "@vitest/spy",
      "expect-type",
      "tinybench",
      "@vitest/snapshot",
      "tinyrainbow",
      "@vitest/pretty-format",
    ],
  });

  cpSync(resolveChai(c.module), `${distDir}/chai.d.cts`);
  writeFileSync(
    `${distDir}/globals.d.ts`,
    `
declare global {
  const suite: typeof import(${MODULE_NAME_LI})['suite']
  const test: typeof import(${MODULE_NAME_LI})['test']
  const describe: typeof import(${MODULE_NAME_LI})['describe']
  const it: typeof import(${MODULE_NAME_LI})['it']
  const expectTypeOf: typeof import(${MODULE_NAME_LI})['expectTypeOf']
  const assertType: typeof import(${MODULE_NAME_LI})['assertType']
  const expect: typeof import(${MODULE_NAME_LI})['expect']
  const vi: typeof import(${MODULE_NAME_LI})['vi']
  const vitest: typeof import(${MODULE_NAME_LI})['vitest']
  const assert: typeof import(${MODULE_NAME_LI})['assert']
  const beforeAll: typeof import(${MODULE_NAME_LI})['beforeAll']
  const afterAll: typeof import(${MODULE_NAME_LI})['afterAll']
  const beforeEach: typeof import(${MODULE_NAME_LI})['beforeEach']
  const afterEach: typeof import(${MODULE_NAME_LI})['afterEach']
  const onTestFailed: typeof import(${MODULE_NAME_LI})['onTestFailed']
  const onTestFinished: typeof import(${MODULE_NAME_LI})['onTestFinished']
}
export {}
`.trim() + "\n"
  );

  console.log(`./dist/${c.name}.d.ts`);
  writeFileSync(
    `./dist/${c.name}.d.ts`,
    `
declare module ${MODULE_NAME_LI} {
  export * from "vitest-types/${c.name}/vitest";
}

`.trim() + ""
  );
}

function resolveChai(pkg: string, chaiRequire = "@vitest/expect/dist/chai.d.cts") {
  const vitestRequire = createRequire(new URL(rootRequire.resolve(pkg), import.meta.url));
  return vitestRequire.resolve(chaiRequire);
}

function bundle(options: { entry: string; bundledPackages?: string[]; output: string }) {
  const projectFolder = new URL("./", import.meta.url).pathname;

  const config = getConfig({
    projectFolder,
    mainEntryPointFilePath: Path.join("<projectFolder>", options.entry),

    bundledPackages: [...(options.bundledPackages ?? [])],
    dtsRollup: {
      enabled: true,
      untrimmedFilePath: Path.join("<projectFolder>", options.output),
    },
  });

  // Load and parse the api-extractor.json file
  const extractorConfig: ExtractorConfig = ExtractorConfig.prepare({
    configObject: config,
    configObjectFullPath: new URL("./fake.json", import.meta.url).pathname,
    packageJsonFullPath: new URL("./package.json", import.meta.url).pathname,
  });

  // Invoke API Extractor
  const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
  });

  if (extractorResult.succeeded) {
    console.log(`API Extractor completed successfully`);
  } else {
    console.error(
      `API Extractor completed with ${extractorResult.errorCount} errors` +
        ` and ${extractorResult.warningCount} warnings`
    );
  }
  return extractorResult;
}

function getConfig(config: IConfigFile) {
  config = cloneDeep(config);
  // @ts-ignore
  ExtractorConfig._resolveConfigFileRelativePaths(config, config.projectFolder);
  defaultsDeep(config, {
    apiReport: { enabled: false },
    docModel: { enabled: false },
    tsdocMetadata: { enabled: false },
  } satisfies Partial<IConfigFile>);
  config.messages = config.messages ?? {};
  if (config.docModel?.enabled === false) {
    defaultsDeep(config.messages, {
      tsdocMessageReporting: {
        default: { logLevel: ExtractorLogLevel.None },
      },
    } satisfies IExtractorMessagesConfig);
  }
  if (config.apiReport?.enabled === false) {
    defaultsDeep(config.messages, {
      extractorMessageReporting: {
        default: { logLevel: ExtractorLogLevel.None },
      },
    } satisfies IExtractorMessagesConfig);
  }
  defaultsDeep(
    config,
    // @ts-ignore
    ExtractorConfig._defaultConfig
  );
  return config;
}
