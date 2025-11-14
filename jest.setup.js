import '@testing-library/jest-dom';

if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      const url = typeof input === 'string' ? input : input.url;
      Object.defineProperty(this, 'url', {
        value: url,
        writable: false,
        enumerable: true,
        configurable: false,
      });
      this.method = init.method || 'GET';
      this.headers = new Headers(init.headers);
      this.body = init.body;
    }
  };
}

global.Headers = class Headers {
  constructor(init = {}) {
    this._headers = {};
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this._headers[key.toLowerCase()] = value;
      });
    }
  }
  get(name) {
    return this._headers[name.toLowerCase()] || null;
  }
  set(name, value) {
    this._headers[name.toLowerCase()] = value;
  }
  has(name) {
    return name.toLowerCase() in this._headers;
  }
};

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || 'OK';
    this.headers = new Headers(init.headers);
    this.ok = this.status >= 200 && this.status < 300;
  }
  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
  }
  async text() {
    return typeof this.body === 'string'
      ? this.body
      : JSON.stringify(this.body);
  }
};
