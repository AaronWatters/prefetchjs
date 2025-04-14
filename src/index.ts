

// export a name string to test module structure
export const name = 'prefetchjs';

type PromiseResponse = Promise<Response> | null;

// prefetcher for a list of urls by index
export class PreFetcher {
    url_prefix: string;
    url_suffixes: string[];
    fetch_promises: PromiseResponse[];

    constructor(url_prefix: string, url_suffixes: string[]) {
        this.url_prefix = url_prefix;
        this.url_suffixes = url_suffixes;
        this.fetch_promises = [];
        for (let i = 0; i < url_suffixes.length; i++) {
            this.fetch_promises.push(null);
        }
    };

    // fetch a url by index
    fetch_by_index(index: number): PromiseResponse {
        // error if the index is out of bounds
        const length = this.url_suffixes.length;
        if (index < 0 || index >= length) {
            console.log('Index out of bounds', index, length);
            throw new Error('Index out of bounds: ' + index);
        }
        if (this.fetch_promises[index] === null) {
            this.fetch_promises[index] = fetch(this.url_prefix + this.url_suffixes[index]);
        }
        return this.fetch_promises[index];
    };

    // fetch an index, prefetch the next, forget the previous
    fetch_next(index: number): PromiseResponse | null {
        // error if the index is out of bounds
        const length = this.url_suffixes.length;
        const fps = this.fetch_promises;
        if (index < 0 || index >= length) {
            console.log('Index out of bounds', index, length);
            throw new Error('Index out of bounds: ' + index);
        }
        if (fps[index] === null) {
            this.fetch_promises[index] = fetch(this.url_prefix + this.url_suffixes[index]);
        }
        if ((index + 1 < length) && (fps[index + 1] === null)) {
            this.fetch_promises[index + 1] = fetch(this.url_prefix + this.url_suffixes[index + 1]);
        }
        if (index - 1 >= 0) {
            this.fetch_promises[index - 1] = null;
        }
        return this.fetch_promises[index];
    };

    // fetch content as array buffer (with prefetch)
    async fetch_buffer(index: number): Promise<ArrayBuffer | null> {
        // error if the index is out of bounds
        const response = await this.fetch_next(index);
        if (response === null) {
            return null;
        }
        const buffer = await response.arrayBuffer();
        return buffer;
    };
};

//export {
//    worker_js,
//};