const https = require("https");

/**
 * A custom fetch implementation using the native Node.js https module.
 * This bypasses node-fetch/undici issues with keep-alive and chunked encoding
 * that sometimes cause ERR_STREAM_PREMATURE_CLOSE when talking to the Groq API.
 */
function customFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const reqOptions = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: options.method || "GET",
        headers: {
          ...options.headers
        }
      };

      // Strip connection and host headers as the request agent manages them
      delete reqOptions.headers["connection"];
      delete reqOptions.headers["host"];

      const req = https.request(reqOptions, (res) => {
        let bodyChunks = [];
        res.on("data", (chunk) => {
          bodyChunks.push(chunk);
        });
        res.on("end", () => {
          const bodyBuffer = Buffer.concat(bodyChunks);
          const bodyText = bodyBuffer.toString("utf8");

          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: new Map(Object.entries(res.headers)),
            text: () => Promise.resolve(bodyText),
            json: () => {
              try {
                return Promise.resolve(JSON.parse(bodyText));
              } catch (err) {
                return Promise.reject(new Error(`Failed to parse response JSON: ${err.message}. Raw: ${bodyText}`));
              }
            }
          });
        });
      });

      req.on("error", (err) => {
        reject(err);
      });

      if (options.body) {
        req.write(options.body);
      }
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { customFetch };
