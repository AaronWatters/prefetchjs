(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.prefetchjs = {}));
})(this, function(exports2) {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  const name = "prefetchjs";
  class PreFetcher {
    constructor(url_prefix, url_suffixes) {
      __publicField(this, "url_prefix");
      __publicField(this, "url_suffixes");
      __publicField(this, "buffer_promises");
      this.url_prefix = url_prefix;
      this.url_suffixes = url_suffixes;
      this.buffer_promises = [];
      for (let i = 0; i < url_suffixes.length; i++) {
        this.buffer_promises.push(null);
      }
    }
    // fetch a url by index
    async fetch_by_index(index) {
      const length = this.url_suffixes.length;
      if (index < 0 || index >= length) {
        console.log("Index out of bounds", index, length);
        throw new Error("Index out of bounds: " + index);
      }
      const url = this.url_prefix + this.url_suffixes[index];
      const response = await fetch(url);
      if (response.status !== 200) {
        console.log("Error fetching url", url, response.status);
        throw new Error("Error fetching url: " + url);
      }
      const buffer = await response.arrayBuffer();
      return buffer;
    }
    // fetch an index, prefetch the next, forget the previous
    fetch_buffer(index) {
      const length = this.url_suffixes.length;
      const bps = this.buffer_promises;
      if (bps[index] === null) {
        bps[index] = this.fetch_by_index(index);
      }
      if (index + 1 < length && bps[index + 1] === null) {
        bps[index + 1] = this.fetch_by_index(index + 1);
      }
      if (index - 1 >= 0) {
        bps[index - 1] = null;
      }
      return bps[index];
    }
  }
  exports2.PreFetcher = PreFetcher;
  exports2.name = name;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
