# Layout Projection

Angular class-based implementation of the [Layout Projection](https://youtu.be/5-JIu0u42Jc) technique by [Matt Perry](https://github.com/mattgperry) for shared-element transitions.

> Big thank to [taowen](https://github.com/taowen) for providing [a GitHub Gist copy](https://gist.github.com/taowen/e102cf5731e527cb9ac02574783c4119) of the original blog by Matt Perry about tech details of Layout Projection.

# Architecture

- `src/lib/core` - framework-independent core implementation of Layout Projection
- `src/lib` except of `src/lib/core` - Angular directives as wrappers of the core implementation.
