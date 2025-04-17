export declare const name = "prefetchjs";
type PromiseBuffer = Promise<ArrayBuffer> | null;
export declare class PreFetcher {
    url_prefix: string;
    url_suffixes: string[];
    buffer_promises: PromiseBuffer[];
    constructor(url_prefix: string, url_suffixes: string[]);
    fetch_by_index(index: number): Promise<ArrayBuffer>;
    fetch_buffer(index: number): PromiseBuffer;
}
export {};
//# sourceMappingURL=index.d.ts.map