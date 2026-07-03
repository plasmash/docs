# Examples

Worked, end-to-end scenarios that show how Plasma's pieces compose into a real solution. Where the [tutorial](../tutorials/first-platform.md) teaches you to author one capability step by step, these show the **shape of a whole solution** — which components, which layers, which channels — and the patterns that hold them together.

Each example is deployable with the same [`compose → up`](../operate/deploying.md) pipeline; the snippets highlight the connective tissue rather than repeat every file (see [Build](../build/component-anatomy.md) for the authoring detail).

<div class="grid cards" markdown>

- :material-transit-connection-variant: **[Ingest & react](ingest-and-react.md)** — pull data from an external system with a connector, then let a choreography of agents detect and notify. Patterns: **connectors · ECST · join vs divide · alerting**.
- :material-chart-timeline-variant: **[Streaming analytics](streaming-analytics.md)** — turn a firehose of raw events into a live metric in the Cognition layer, then query it. Patterns: **cross-layer relays · DIKW · metrics · Trino**.

</div>

All scenarios use **neutral, generic domains** — adapt the entity and thresholds to yours.
