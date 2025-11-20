declare global {
  interface Window {
    bootstrap?: {
      Modal: new (el: HTMLElement) => { show(): void; hide(): void };
      Toast: new (el: HTMLElement, options?: { autohide?: boolean; delay?: number }) => { show(): void; hide(): void };
    };
  }
}

export {};


