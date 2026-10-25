/**
 * Host half of `dsh-qq2006`.
 *
 * The skin itself lives entirely in the browser: the Host only needs to keep the
 * Loader row alive so the client-modules scanner publishes the `./client`
 * bundle. Keeping this half dependency-free is deliberate — the previous
 * iteration imported optional Host peers (`dsh-settings`, `schemastery`) and
 * silently lost its settings face whenever those peers changed shape.
 *
 * @module dsh-qq2006/host
 */

/** Cordis plugin name, matching the bundle patch row id. */
export const name = 'qq2006-skin'

/** No Host services are required. */
export const inject: string[] = []

/**
 * Activate the Host half.
 *
 * Nothing to register: the browser half owns the whole skin and persists its
 * own state in `localStorage`.
 */
export function apply(): void {
  // Intentionally empty.
}
