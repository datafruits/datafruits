 
module.exports = function (environment) {
  return {
    buildSandboxGlobals(defaultGlobals) {
      return Object.assign({}, defaultGlobals, {
        fetch,
        URLSearchParams,
        AbortController,
        DOMException,
        Response,
        ReadableStream:
          typeof ReadableStream !== 'undefined' ? ReadableStream : require('node:stream/web').ReadableStream,
        WritableStream:
          typeof WritableStream !== 'undefined' ? WritableStream : require('node:stream/web').WritableStream,
        TransformStream:
          typeof TransformStream !== 'undefined' ? TransformStream : require('node:stream/web').TransformStream,
        Headers: typeof Headers !== 'undefined' ? Headers : undefined,
      });
    },
  };
};
