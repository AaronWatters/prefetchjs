

// export a name string to test module structure
export const name = 'prefetchjs';

type PromiseBuffer = Promise<ArrayBuffer> | null;

// prefetcher for a list of urls by index
export class PreFetcher {
    url_prefix: string;
    url_suffixes: string[];
    buffer_promises: PromiseBuffer[];

    constructor(url_prefix: string, url_suffixes: string[]) {
        this.url_prefix = url_prefix;
        this.url_suffixes = url_suffixes;
        this.buffer_promises = [];
        for (let i = 0; i < url_suffixes.length; i++) {
            this.buffer_promises.push(null);
        }
    };

    // fetch a url by index
    async fetch_by_index(index: number): Promise<ArrayBuffer> {
        // error if the index is out of bounds
        const length = this.url_suffixes.length;
        if (index < 0 || index >= length) {
            console.log('Index out of bounds', index, length);
            throw new Error('Index out of bounds: ' + index);
        }
        const url = this.url_prefix + this.url_suffixes[index];
        //.log('fetching url', url);
        const response = await fetch(url);
        if (response.status !== 200) {
            console.log('Error fetching url', url, response.status);
            throw new Error('Error fetching url: ' + url);
        }
        const buffer = await response.arrayBuffer();
        return buffer;
    };

    // fetch an index, prefetch the next, forget the previous
    fetch_buffer(index: number): PromiseBuffer {
        // error if the index is out of bounds
        const length = this.url_suffixes.length;
        const bps = this.buffer_promises;
        if (bps[index] === null) {
            bps[index] = this.fetch_by_index(index);
        }
        if ((index + 1 < length) && (bps[index + 1] === null)) {
            bps[index+1] = this.fetch_by_index(index+1);
        }
        // free previous buffer
        if (index - 1 >= 0) {
            bps[index - 1] = null;
        }
        return bps[index];
    };
};

//export {
//    worker_js,
//};