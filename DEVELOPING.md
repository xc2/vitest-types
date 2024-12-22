## Patches

### vitest

Patches are applied to `vitest` package as `@microsoft/api-extractor` doesn't work well with the code below:

```ts
export { Foo } from 'foo';
declare module "foo" {
    interface Foo {}
}
```