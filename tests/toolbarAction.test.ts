import { describe, expect, it, vi } from 'vitest';

import { handleToolbarClick } from '../lib/toolbarAction';

describe('handleToolbarClick', () => {
  it('shortens the active HTTPS tab in one action', async () => {
    const tab = { id: 42, url: 'https://example.com/current?page=1' };
    const shorten = vi.fn().mockResolvedValue(undefined);

    const result = await handleToolbarClick(tab, shorten);

    expect(result).toBe('shortened');
    expect(shorten).toHaveBeenCalledOnce();
    expect(shorten).toHaveBeenCalledWith(tab.url, tab);
  });

  it('allows ordinary HTTP tabs', async () => {
    const tab = { id: 7, url: 'http://example.test/page' };
    const shorten = vi.fn().mockResolvedValue(undefined);

    const result = await handleToolbarClick(tab, shorten);

    expect(result).toBe('shortened');
    expect(shorten).toHaveBeenCalledWith(tab.url, tab);
  });

  it.each([undefined, 'about:config', 'moz-extension://settings', 'file:///tmp/test.html'])(
    'rejects unsupported active-tab URL %s without creating a Zipline record',
    async (url) => {
      const shorten = vi.fn().mockResolvedValue(undefined);

      const result = await handleToolbarClick({ id: 9, url }, shorten);

      expect(result).toBe('unsupported');
      expect(shorten).not.toHaveBeenCalled();
    }
  );
});
