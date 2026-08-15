import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('background toolbar action', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it('clears the settings popup and shortens the clicked active tab', async () => {
    let actionListener: ((tab: { id?: number; url?: string }) => Promise<void>) | undefined;
    const setPopup = vi.fn().mockResolvedValue(undefined);
    const executeScript = vi.fn().mockResolvedValue([{ result: undefined }]);
    const notification = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'https://3p.rs/Ab12' }),
    });

    const event = () => ({ addListener: vi.fn() });
    const fakeBrowser = {
      action: {
        setPopup,
        onClicked: {
          addListener: vi.fn((listener) => {
            actionListener = listener;
          }),
        },
      },
      runtime: {
        onInstalled: event(),
        onStartup: event(),
        onMessage: event(),
        openOptionsPage: vi.fn(),
        getURL: (path: string) => path,
      },
      contextMenus: {
        onClicked: event(),
        removeAll: (callback: () => void) => callback(),
        create: vi.fn(),
      },
      notifications: { create: notification },
      storage: {
        sync: {
          get: vi.fn().mockResolvedValue({
            requestURL: 'https://3p.rs/api/upload',
            authToken: 'test-token',
          }),
        },
      },
      scripting: { executeScript },
    };

    vi.stubGlobal('browser', fakeBrowser);
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('defineBackground', (start: () => void) => start());

    await import('../entrypoints/background');

    expect(setPopup).toHaveBeenCalledWith({ popup: '' });
    expect(actionListener).toBeTypeOf('function');

    await actionListener?.({ id: 12, url: 'https://example.com/current' });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://3p.rs/api/user/urls',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ destination: 'https://example.com/current' }),
      })
    );
    expect(executeScript).toHaveBeenCalledOnce();
    expect(notification).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'URL Shortened',
        message: 'The shortened URL has been copied to your clipboard.',
      })
    );
  });

  it('does not call Zipline for unsupported browser pages', async () => {
    let actionListener: ((tab: { id?: number; url?: string }) => Promise<void>) | undefined;
    const fetchMock = vi.fn();
    const event = () => ({ addListener: vi.fn() });
    const notification = vi.fn();
    const fakeBrowser = {
      action: {
        setPopup: vi.fn().mockResolvedValue(undefined),
        onClicked: {
          addListener: vi.fn((listener) => {
            actionListener = listener;
          }),
        },
      },
      runtime: {
        onInstalled: event(),
        onStartup: event(),
        onMessage: event(),
        openOptionsPage: vi.fn(),
        getURL: (path: string) => path,
      },
      contextMenus: {
        onClicked: event(),
        removeAll: (callback: () => void) => callback(),
        create: vi.fn(),
      },
      notifications: { create: notification },
      storage: { sync: { get: vi.fn().mockResolvedValue({}) } },
      scripting: { executeScript: vi.fn() },
    };

    vi.stubGlobal('browser', fakeBrowser);
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('defineBackground', (start: () => void) => start());

    await import('../entrypoints/background');
    await actionListener?.({ id: 1, url: 'about:config' });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(notification).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Cannot Shorten This Page' })
    );
  });
});
