import { defineConfig } from 'wxt';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifestVersion: 3,
  alias: {
    '@': resolve('.'),
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: '3p.rs Share',
    description: 'Shorten the current tab with one click and upload media to Zipline.',
    permissions: [
      'storage',
      'contextMenus',
      'activeTab',
      'clipboardWrite',
      'notifications',
      'scripting',
    ],
    host_permissions: ['*://*/*'],
    action: {
      default_title: 'Shorten current tab and copy',
    },
    icons: {
      48: '/icon/48.png',
      128: '/icon/128.png',
    },
    browser_specific_settings: {
      gecko: {
        id: 'share@3p.rs',
        strict_min_version: '142.0',
        data_collection_permissions: {
          required: ['browsingActivity', 'websiteContent'],
        },
      },
    },
  },
});
