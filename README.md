# vitest-types

This package allows you to use `import { expect, test, ... } from "vitest"` statements in your ts test files without needing to add `vitest` to your `dependencies` or `devDependencies` lists.

## Installation

```sh
pnpm/yarn/npm add --save-dev vitest-types
```

Then add `vitest-types` to `compilerOptions.types` list in the `tsconfig.json`. For example:

```json
{
  "compilerOptions": {
    "types": ["vitest-types"]
  }
}
```

Now you can use `import { expect, test, ... } from "vitest"` in your test files.

```ts
// a.d.ts
import { expect, test } from "vitest";

test('foo', () => {
  expect(1).toBe(1);
})
```

## APIs Global Injection

When you're running vitest with apis global injection(`--globals`), you should also add `vitest-types/globals` to the `compilerOptions.types` list. For example:

```json
{
  "compilerOptions": {
    "types": ["vitest-types/globals"]
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