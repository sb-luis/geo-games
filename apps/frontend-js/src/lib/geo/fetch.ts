import type { GeoCollection } from './types';
import type { FetchResponse } from '@/workers/geoFetch.worker';

// Cache the Promise so concurrent callers share one in-flight request.
const cache = new Map<string, Promise<GeoCollection>>();

function loadInWorker(url: string): Promise<GeoCollection> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../../workers/geoFetch.worker.ts', import.meta.url));
    worker.onmessage = (e: MessageEvent<FetchResponse>) => {
      worker.terminate();
      if (e.data.ok) resolve(e.data.data);
      else reject(new Error(e.data.error));
    };
    worker.onerror = (e) => { worker.terminate(); reject(e); };
    worker.postMessage({ url });
  });
}

export function fetchGeo(url: string): Promise<GeoCollection> {
  if (!cache.has(url)) {
    const p = loadInWorker(url);
    p.catch(() => cache.delete(url));
    cache.set(url, p);
  }
  return cache.get(url)!;
}
