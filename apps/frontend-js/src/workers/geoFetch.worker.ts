import type { GeoCollection } from '@/lib/geo/types';

export interface FetchRequest { url: string }
export type FetchResponse =
  | { ok: true;  data: GeoCollection }
  | { ok: false; error: string }

// TypeScript types `self` as Window under the dom lib; cast to any to satisfy the
// worker-specific onmessage/postMessage signatures at runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const workerSelf = self as any;

workerSelf.onmessage = async (e: MessageEvent<FetchRequest>) => {
  const { url } = e.data;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    const data: GeoCollection = await r.json();
    workerSelf.postMessage({ ok: true, data } satisfies FetchResponse);
  } catch (err) {
    workerSelf.postMessage({ ok: false, error: String(err) } satisfies FetchResponse);
  }
};
