## Patches

### patches/vitest@2.1.8.patch

Patches are applied to `vitest@2.1.8` package as `@microsoft/api-extractor` doesn't work well with the code below:

```ts
export { Foo } from 'foo';
declare module "foo" {
    interface Foo {}
}
```

### patches/@microsoft__api-extractor.patch

This file is not applied as it breaks dependency referencing.
