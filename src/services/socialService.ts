import { localDB } from '../lib/localDB';
import { Post, UserRelationship, FollowerCircle, PostComment } from '../types/handyBet';

export const socialService = {
  // Seguir a un usuario (Unidireccional)
  async followUser(followerId: string, followingId: string): Promise<UserRelationship> {
    const result = await localDB.relationships.follow(followerId, followingId);
    return result;
  },

  // Dejar de seguir a un usuario
  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await localDB.relationships.unfollow(followerId, followingId);
  },

  // Crear un nuevo círculo de confianza
  async createCircle(ownerId: string, name: string): Promise<FollowerCircle> {
    const circles = await localDB.relationships.getCircles(ownerId);
    const newCircle: FollowerCircle = {
      id: localDB.generateId('crc'),
      owner_id: ownerId,
      name,
      created_at: new Date().toISOString()
    };
    // Access raw DB to push
    const db = await localDB.init();
    db.relationships.circles.push({ ...newCircle, members: [] });
    await localDB.persist();
    return newCircle;
  },

  // Crear una nueva publicación
  async createPost(postData: Omit<Post, 'id' | 'created_at'>): Promise<Post> {
    const newPost = {
      ...postData,
      id: localDB.generateId('post'),
      media_urls: (postData as any).media_urls || [],
      likes: [],
      shares_count: 0,
      created_at: new Date().toISOString()
    };

    await localDB.posts.insert(newPost);
    const resolved = await localDB.resolvePostWithAuthor(newPost);
    return resolved;
  },

  // Feed principal relacional por capas de visibilidad
  async getFeedPosts(userId: string): Promise<Post[]> {
    const allPosts = await localDB.posts.getAll();
    const following = await localDB.relationships.getFollowing(userId);
    const followedUserIds = following.map((f: any) => f.following_id);
    const circleMemberships = await localDB.relationships.getCircleMemberships(userId);

    // Get groups the user belongs to
    const allGroups = await localDB.groups.getAll();
    const memberGroups = allGroups
      .filter((g: any) => g.members?.includes(userId))
      .map((g: any) => g.id);

    // Filter by visibility
    const visiblePosts = allPosts.filter((post: any) => {
      if (post.author_id === userId) return true;
      if (post.channel_id) return true; // Canales públicos aparecen en feed
      if (post.visibility_level === 'todos') return true;
      if (post.post_type === 'advertisement' && post.payment_status === 'pagado') return true;
      if (post.group_id && memberGroups.includes(post.group_id)) return true;
      if (post.visibility_level === 'seguidores' && followedUserIds.includes(post.author_id)) return true;
      if (post.visibility_level === 'circulo' && post.circle_id && circleMemberships.includes(post.circle_id)) return true;
      return false;
    });

    // Sort by date descending
    visiblePosts.sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Resolve author and group for each post
    const resolved = await Promise.all(visiblePosts.map((p: any) => localDB.resolvePostWithAuthor(p)));
    return resolved;
  },

  async getPostComments(postId: string): Promise<PostComment[]> {
    const allComments = await localDB.comments.getAll();
    const filtered = allComments.filter((c: any) => c.post_id === postId);
    // Sort by date ascending
    filtered.sort((a: any, b: any) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const resolved = await Promise.all(filtered.map((c: any) => localDB.resolveCommentWithAuthor(c)));
    return resolved;
  },

  async createPostComment(postId: string, commentData: Omit<PostComment, 'id' | 'created_at'>): Promise<PostComment> {
    const newComment = {
      ...commentData,
      id: localDB.generateId('c'),
      post_id: postId,
      created_at: new Date().toISOString()
    };
    await localDB.comments.insert(newComment);
    const resolved = await localDB.resolveCommentWithAuthor(newComment);
    return resolved;
  },

  // Like / Unlike
  async toggleLike(postId: string, userId: string): Promise<boolean> {
    const post = await localDB.posts.getById(postId);
    if (!post) return false;

    const likes: string[] = post.likes || [];
    const isLiked = likes.includes(userId);

    if (isLiked) {
      post.likes = likes.filter((id: string) => id !== userId);
    } else {
      post.likes = [...likes, userId];
    }

    await localDB.posts.update(postId, { likes: post.likes });
    return !isLiked;
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<any> {
    return localDB.users.getById(userId);
  },

  // Get follower/following counts
  async getFollowerCount(userId: string): Promise<number> {
    const followers = await localDB.relationships.getFollowers(userId);
    return followers.length;
  },

  async getFollowingCount(userId: string): Promise<number> {
    const following = await localDB.relationships.getFollowing(userId);
    return following.length;
  },

  // Search users
  async searchUsers(query: string): Promise<any[]> {
    const allUsers = await localDB.users.getAll();
    const lower = query.toLowerCase();
    return allUsers.filter((u: any) =>
      u.full_name?.toLowerCase().includes(lower) ||
      u.username?.toLowerCase().includes(lower)
    );
  }
};
