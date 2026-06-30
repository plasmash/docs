# Debugging

Playbooks for the problems you'll actually hit. Most fall into one of two buckets: a deployment that won't update, or a flow that won't fire.

## Deployment problems

### Image not updating after a change

**Symptom:** pods keep running the old image despite code changes.
**Fix:** the version didn't change. Run `plasmactl component:bump`, commit, push, redeploy — `bump` stamps the new git hash so the build pipeline picks it up.

### StatefulSet not updating

**Symptom:** StatefulSet pods don't get the new image automatically.
**Cause:** StatefulSets don't auto-roll like Deployments.
**Fix:** confirm `meta/plasma.yaml` shows the new hash, then force recreation: `kubectl delete pod <pod> -n <namespace>` — it comes back with the new image.

### Service pods crashing on config

**Symptom:** a service pod crashes with a configuration error.
**Fix:** correct it in the **service** role, not the application that orchestrates it (see [Configuration](../build/configuration.md#configure-at-the-service-level-never-the-application)).

### Variables not resolving

**Symptom:** a variable is missing or has the wrong value.
**Fix:** check the [three-tier resolution](../build/configuration.md#the-three-tier-resolution) — is the variable component-prefixed, defined in `defaults/main.yaml`, and overridden in the right zone `group_vars`? Use `plasmactl platform:variables-check` to find orphans and missings.

### Forcing a rebuild

**When:** a component needs rebuilding but `component:bump` says "nothing to bump" (e.g. a base image changed but your code didn't).
**Technique:** manually edit the version field in `meta/plasma.yaml` to a different value. `bump` compares git state, so changing the recorded version triggers a fresh build.

## RBAC problems

**Symptom:** `CrashLoopBackOff` with "access denied" or "Service Account permissions" errors.
**Fix:** the workload is probably using custom RBAC. Remove it and adopt the [centralized service-account pattern](../build/kubernetes.md#service-accounts-the-centralized-pattern) — verify the `group_vars` override exists for the zone.

## Agent flows

When an agent doesn't behave, trace the **channel chain backwards** from the symptom — full table in [Choreography → debugging agent flows](../concepts/choreography.md#debugging-agent-flows):

| Symptom | Look at |
|---|---|
| Agent never fires | Its channel subscription |
| Wrong agents fire | A channel that's too broad |
| Wrong skill selected | The agent's selection logic |
| Bad output | The skill config or function |
| Output not reaching downstream | Join vs divide on the output channel |

→ Back to the [Operate overview](index.md).
