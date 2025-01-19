# vitest-types

This package allows you to use `import { expect, test, ... } from "vitest"` statements in your ts test files without needing to add `vitest` to your `dependencies` or `devDependencies` lists.

Supported versions:
- vitest 2.x
- vitest 3.x

> [!NOTE]
> Vitest Node APIs are not included in this package. You will still need to install `vitest` to use them. For example:
>
> - `vitest/node`
> - `vitest/config`

## Installation

```sh
pnpm/yarn/npm add --save-dev vitest-types
```

### vitest 2.x

Then add `vitest-types/2` to `compilerOptions.types` list in the `tsconfig.json`. For example:

```json
{
  "compilerOptions": {
    "types": ["vitest-types/2"]
  }
}
```

### vitest 3.x

Then add `vitest-types/3` to `compilerOptions.types` list in the `tsconfig.json`. For example:

```json
{
  "compilerOptions": {
    "types": ["vitest-types/3"]
  }
}
```

Now you can use `import { expect, test, ... } from "vitest"` in your test files.

```ts
// a.test.ts
import { expect, test } from "vitest";

test('foo', () => {
  expect(1).toBe(1);
})
```

## APIs Global Injection

When you're running vitest with apis global injection(`--globals`), you should also add `vitest-types/2/globals`/`vitest-types/3/globals` to the `compilerOptions.types` list. For example:

```json
{
  "compilerOptions": {
    "types": ["vitest-types/2/globals"]
  }
}
```

```ts
// a.test.ts
test('foo', () => {
  expect(1).toBe(1);
})
```

## License

[MIT ©️ xc2](https://tldr.ws/mitxc2)
