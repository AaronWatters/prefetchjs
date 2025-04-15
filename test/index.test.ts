
import { describe, expect, it, vi } from 'vitest';
import { 
  name,
  worker_js,
  PreFetcher,
  //tsvector
 } from '../src/index';

function stubFetches() {
  vi.stubGlobal(
    'fetch', 
    vi.fn((url: string) => {
      //console.log('mock fetch', url);
      return new Promise((resolve) => {
        setTimeout(() => {
          const id = url.split('/').pop();
          //console.log('mock fetching', url, id);
          const response = new Response(JSON.stringify({ id: id}));
          resolve(response);
        }, 100);
      });
    })
  );
};

describe('Basics', () => {
  it('should return the correct name', () => {
    expect(name).toBe('prefetchjs');
  });
  it('should be running in jsdom', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
    //expect(typeof Worker).toBe('function');
    expect(typeof Blob).toBe('function');
  });
  it ('should fetch some urls', async () => {
    stubFetches();
    const pf = new PreFetcher('https://jsonplaceholder.typicode.com/posts/', ['111', '222', '333']);
    const bps = pf.buffer_promises;
    const response = await pf.fetch_buffer(0);
    expect(bps[0]).toBeInstanceOf(Promise);
    expect(bps[1]).toBeInstanceOf(Promise);
    expect(response).toBeInstanceOf(ArrayBuffer);
    const str = new TextDecoder().decode(response!);
    //console.log('response', str);
    expect(str).toBe(JSON.stringify({ id: '111' }));
    const response2 = await pf.fetch_buffer(1);
    expect(response2).toBeInstanceOf(ArrayBuffer);
    const str2 = new TextDecoder().decode(response2!);
    //console.log('response2', str2);
    expect(str2).toBe(JSON.stringify({ id: '222' }));
    expect(bps[2]).toBeInstanceOf(Promise);
    expect(bps[1]).toBeInstanceOf(Promise);
    expect(bps[0]).toBeNull();
  });
});
