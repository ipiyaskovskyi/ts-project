declare global {
  interface Window {
    bootstrap?: {
      Modal: new (el: HTMLElement) => { show(): void; hide(): void };
    };
  }
}

export {};


