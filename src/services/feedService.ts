import { localDB } from '../lib/localDB';

export const feedService = {
  async getFeedPosts(): Promise<any[]> {
    const allPosts = await localDB.posts.getAll();

    // Sort by date descending
    const sorted = [...allPosts].sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Resolve authors and map to feed format
    const resolved = await Promise.all(sorted.map(async (p: any) => {
      const post = await localDB.resolvePostWithAuthor(p);
      return {
        id: post.id,
        author: post.author?.full_name || 'Usuario',
        username: `@${post.author_id?.replace('usr_', '') || 'unknown'}`,
        avatar: post.author?.avatar_url || 'https://i.pravatar.cc/150',
        time: getRelativeTime(post.created_at),
        text: post.content,
        mediaType: post.media_type,
        mediaUrl: post.media_urls?.[0] || post.media_url || null,
        mediaUrls: post.media_urls || (post.media_url ? [post.media_url] : []),
        likes: post.likes || [],
        shares_count: post.shares_count || 0,
        group: post.group,
      };
    }));

    return resolved;
  }
};

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}
