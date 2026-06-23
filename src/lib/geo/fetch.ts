import type { GeoCollection } from './types';

// Cache the Promise, not the resolved value — callers that arrive while a fetch
// is in-flight share the same Promise instead of each making their own request.
const cache = new Map<string, Promise<GeoCollection>>();

export function fetchGeo(url: string): Promise<GeoCollection> {
  if (!cache.has(url)) {
    cache.set(url, fetch(url).then(r => r.json() as Promise<GeoCollection>));
  }
  return cache.get(url)!;
}
