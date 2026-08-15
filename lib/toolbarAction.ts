export type ToolbarTab = {
  id?: number;
  url?: string;
};

export type ShortenTab = (url: string, tab: ToolbarTab) => Promise<void>;

export async function handleToolbarClick(
  tab: ToolbarTab,
  shorten: ShortenTab
): Promise<'shortened' | 'unsupported'> {
  if (!tab.url || !/^https?:\/\//i.test(tab.url)) return 'unsupported';

  await shorten(tab.url, tab);
  return 'shortened';
}
