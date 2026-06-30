# Entity schemas

The [ontology](../concepts/patterns.md#ontology-as-data-contract) — entities and metrics — is the stable contract between every system in Plasma. That contract is defined as schemas, and Plasma manages them so they can evolve without breaking consumers.

## Protobuf is the source of truth

An entity's schema lives in its component:

```
<entity_role>/files/<entity_name>.proto
```

Protobuf is chosen deliberately: it supports **backward- and forward-compatible** evolution.

- Proto package convention: `machine.<entity_name>` (e.g. `machine.person`)
- Primary keys are marked with a custom option: `[(is_primary_key) = true]`

```proto
syntax = "proto3";
package machine.person;

message Person {
  string id = 1 [(is_primary_key) = true];
  string display_name = 2;
}
```

## JSON Schema generation

JSON schemas are generated from the proto via an action:

```sh
plasmactl platform.entities:generate-schemas
```

Internally this runs `protoc` with `protoc-gen-jsonschema`. The JSON schemas are used at **build time** for validation and connector configuration, and a Jinja2 `json_schema` filter loads them into templates.

## The schema registry

At **runtime**, schemas live in an **Apicurio Registry**. So:

- **Build-time** schemas ship inside component files.
- **Runtime** schemas are served from the registry.

## Changes are breaking changes

Because so much depends on the ontology, a change to an entity or metric schema is a **breaking change** that requires migration planning. Protobuf's compatibility rules give you room to evolve (add fields, deprecate carefully) — but plan the change as a contract change, because that's what it is.

→ Next: [Kubernetes patterns](kubernetes.md).
