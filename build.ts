import { writeFileSync } from "node:fs";
import {
  Extractor,
  ExtractorConfig,
  ExtractorLogLevel,
  type ExtractorResult,
  type IConfigFile,
  type IExtractorMessagesConfig,
} from "@microsoft/api-extractor";
import { cloneDeep, defaultsDeep } from "lodash-es";

const projectFolder = new URL("./", import.meta.url).pathname;

const config = getConfig({
  projectFolder,
  mainEntryPointFilePath: "<projectFolder>/src/vitest-218.d.ts",

  bundledPackages: ["vitest", "@vitest/runner", "@vitest/utils", "@vitest/expect"],
  dtsRollup: { enabled: true, untrimmedFilePath: "<projectFolder>/dist/vitest-218/types.d.ts" },
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
  writeFileSync(
    new URL("./dist/vitest-218/index.d.ts", import.meta.url).pathname,
    `
declare module "vitest-demo" {
  export * from "vitest-types/vitest-218/types"
}
    `
  );
  process.exitCode = 0;
} else {
  console.error(
    `API Extractor completed with ${extractorResult.errorCount} errors` +
      ` and ${extractorResult.warningCount} warnings`
  );
  process.exitCode = 1;
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
