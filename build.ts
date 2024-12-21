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
// const externals = {
//   "@vitest/expect": ["ExpectStatic"],
//   "@vitest/pretty-format": ["CompareKeys", "PrettyFormatOptions"],
//   "@vitest/runner": [
//     "afterAll",
//     "afterEach",
//     "beforeAll",
//     "describe",
//     "it",
//     "onTestFailed",
//     "onTestFinished",
//     "suite",
//     "test",
//   ],
//   "@vitest/utils": ["Constructable", "stringify"],
//   "@vitest/utils/diff": ["diff"],
//   tinyrainbow: ["Formatter"],
// };
// let externalsDTS = ``;
// for (const [key, value] of Object.entries(externals)) {
//   externalsDTS += `export { ${value.join(", ")} } from "${key}";\n`;
// }
//
// writeFileSync(new URL("./src/2/externals.d.ts", import.meta.url).pathname, externalsDTS);
// bundle({
//   entry: "src/2/externals.d.ts",
//   output: "dist/2/externals.d.ts",
//   bundledPackages: [
//     "@vitest/expect",
//     "@vitest/runner",
//     "@vitest/utils",
//     "tinyrainbow",
//     "@vitest/pretty-format",
//   ],
// });
bundle({
  entry: "./src/2/vitest.d.ts",
  output: "./dist/2/vitest.d.ts",
  bundledPackages: [
    "chai",
    "vitest",
    "@vitest/expect",
    "@vitest/runner",
    "@vitest/utils",
    "tinyrainbow",
    "@vitest/pretty-format",
  ],
});

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
    //     writeFileSync(
    //       new URL("./dist/vitest-218/index.d.ts", import.meta.url).pathname,
    //       `
    // declare module "vitest-demo" {
    //   export * from "vitest-types/vitest-218/types"
    // }
    //     `
    //     );
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
