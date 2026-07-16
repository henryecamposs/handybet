import AsyncStorage from '@react-native-async-storage/async-storage';

// Import seed data
import seedUsers from '../data/users.json';
import seedRelationships from '../data/relationships.json';
import seedPosts from '../data/posts.json';
import seedComments from '../data/comments.json';
import seedNews from '../data/news.json';
import seedAds from '../data/ads.json';
import seedChannels from '../data/channels.json';
import seedGroups from '../data/groups.json';
import seedChats from '../data/chats.json';
import seedPrizes from '../data/prizes.json';
import seedBets from '../data/bets.json';
import seedMediaVault from '../data/media_vault.json';
import seedUserSubscriptions from '../data/user_subscriptions.json';

const DB_KEY = 'handybet_local_db';

export interface LocalDatabase {
  users: any[];
  relationships: { follows: any[]; circles: any[]; friend_suggestions: any[] };
  posts: any[];
  comments: any[];
  news: any[];
  ads: any[];
  channels: any[];
  groups: any[];
  chats: any[];
  prizes: any[];
  bets: any[];
  media_vault: any[];
  user_subscriptions: any[];
  _initialized: boolean;
}

// In-memory database instance
let db: LocalDatabase | null = null;

/**
 * Initialize or load the local database.
 * On first run, seeds from JSON files.
 * On subsequent runs, loads from AsyncStorage.
 */
async function initDB(): Promise<LocalDatabase> {
  if (db) return db;

  try {
    const stored = await AsyncStorage.getItem(DB_KEY);
    if (stored) {
      db = JSON.parse(stored);
      if (db && db._initialized) {
        return db;
      }
    }
  } catch (e) {
    console.warn('[LocalDB] Could not load from AsyncStorage, seeding fresh:', e);
  }

  // Seed fresh database
  db = {
    users: seedUsers as any[],
    relationships: seedRelationships as any,
    posts: seedPosts as any[],
    comments: seedComments as any[],
    news: seedNews as any[],
    ads: seedAds as any[],
    channels: seedChannels as any[],
    groups: seedGroups as any[],
    chats: seedChats as any[],
    prizes: seedPrizes as any[],
    bets: seedBets as any[],
    media_vault: seedMediaVault as any[],
    user_subscriptions: seedUserSubscriptions as any[],
    _initialized: true,
  };

  await persist();
  return db;
}

/** Persist the current in-memory database to AsyncStorage */
async function persist(): Promise<void> {
  if (!db) return;
  try {
    await AsyncStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn('[LocalDB] Failed to persist:', e);
  }
}

/** Generate a random ID */
function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 11)}`;
}

// ─── GENERIC CRUD ──────────────────────────────────────────

function createCollection<T extends { id: string }>(collectionKey: keyof LocalDatabase) {
  return {
    async getAll(): Promise<T[]> {
      const database = await initDB();
      return (database[collectionKey] as any) || [];
    },

    async getById(id: string): Promise<T | null> {
      const database = await initDB();
      const items = database[collectionKey] as any[];
      return items?.find((item: any) => item.id === id) || null;
    },

    async getWhere(predicate: (item: T) => boolean): Promise<T[]> {
      const database = await initDB();
      const items = database[collectionKey] as any[];
      return items?.filter(predicate) || [];
    },

    async insert(item: Omit<T, 'id'> & { id?: string }): Promise<T> {
      const database = await initDB();
      const newItem = { ...item, id: item.id || generateId(collectionKey as string) } as T;
      (database[collectionKey] as any[]).push(newItem);
      await persist();
      return newItem;
    },

    async update(id: string, updates: Partial<T>): Promise<T | null> {
      const database = await initDB();
      const items = database[collectionKey] as any[];
      const index = items.findIndex((item: any) => item.id === id);
      if (index === -1) return null;
      items[index] = { ...items[index], ...updates };
      await persist();
      return items[index];
    },

    async delete(id: string): Promise<boolean> {
      const database = await initDB();
      const items = database[collectionKey] as any[];
      const index = items.findIndex((item: any) => item.id === id);
      if (index === -1) return false;
      items.splice(index, 1);
      await persist();
      return true;
    },

    async upsert(id: string, item: T): Promise<T> {
      const database = await initDB();
      const items = database[collectionKey] as any[];
      const index = items.findIndex((i: any) => i.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...item };
      } else {
        items.push(item);
      }
      await persist();
      return items.find((i: any) => i.id === id) || item;
    }
  };
}

// ─── SPECIALIZED ACCESSORS ─────────────────────────────────

const relationshipsAccess = {
  async getFollows(): Promise<any[]> {
    const database = await initDB();
    return database.relationships.follows || [];
  },

  async getFollowers(userId: string): Promise<any[]> {
    const database = await initDB();
    return database.relationships.follows.filter((f: any) => f.following_id === userId);
  },

  async getFollowing(userId: string): Promise<any[]> {
    const database = await initDB();
    return database.relationships.follows.filter((f: any) => f.follower_id === userId);
  },

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const database = await initDB();
    return database.relationships.follows.some(
      (f: any) => f.follower_id === followerId && f.following_id === followingId
    );
  },

  async follow(followerId: string, followingId: string): Promise<any> {
    const database = await initDB();
    const existing = database.relationships.follows.find(
      (f: any) => f.follower_id === followerId && f.following_id === followingId
    );
    if (existing) return existing;

    const newFollow = { follower_id: followerId, following_id: followingId, created_at: new Date().toISOString() };
    database.relationships.follows.push(newFollow);
    await persist();
    return newFollow;
  },

  async unfollow(followerId: string, followingId: string): Promise<boolean> {
    const database = await initDB();
    const idx = database.relationships.follows.findIndex(
      (f: any) => f.follower_id === followerId && f.following_id === followingId
    );
    if (idx === -1) return false;
    database.relationships.follows.splice(idx, 1);
    await persist();
    return true;
  },

  async getCircles(ownerId: string): Promise<any[]> {
    const database = await initDB();
    return database.relationships.circles.filter((c: any) => c.owner_id === ownerId);
  },

  async getCircleMemberships(userId: string): Promise<string[]> {
    const database = await initDB();
    return database.relationships.circles
      .filter((c: any) => c.members?.includes(userId))
      .map((c: any) => c.id);
  },

  async getFriendSuggestions(userId: string): Promise<any[]> {
    const database = await initDB();
    return database.relationships.friend_suggestions.filter((s: any) => s.user_id === userId);
  }
};

const chatsAccess = {
  async getAll(): Promise<any[]> {
    const database = await initDB();
    return database.chats || [];
  },

  async getForUser(userId: string): Promise<any[]> {
    const database = await initDB();
    return database.chats.filter((chat: any) =>
      chat.participants.includes(userId)
    );
  },

  async getById(chatId: string): Promise<any | null> {
    const database = await initDB();
    return database.chats.find((c: any) => c.id === chatId) || null;
  },

  async getOrCreateDM(userId1: string, userId2: string): Promise<any> {
    const database = await initDB();
    const existing = database.chats.find((c: any) =>
      c.type === 'direct' &&
      c.participants.includes(userId1) &&
      c.participants.includes(userId2)
    );
    if (existing) return existing;

    const newChat = {
      id: generateId('chat'),
      type: 'direct',
      participants: [userId1, userId2],
      messages: [],
      created_at: new Date().toISOString()
    };
    database.chats.push(newChat);
    await persist();
    return newChat;
  },

  async sendMessage(chatId: string, senderId: string, content: string): Promise<any> {
    const database = await initDB();
    const chat = database.chats.find((c: any) => c.id === chatId);
    if (!chat) return null;

    const message = {
      id: generateId('m'),
      sender_id: senderId,
      content,
      created_at: new Date().toISOString()
    };
    chat.messages.push(message);
    await persist();
    return message;
  }
};

// ─── JOIN HELPERS ───────────────────────────────────────────

async function resolvePostWithAuthor(post: any): Promise<any> {
  const database = await initDB();
  const author = database.users.find((u: any) => u.id === post.author_id);
  const group = post.group_id ? database.groups.find((g: any) => g.id === post.group_id) : null;

  return {
    ...post,
    author: author ? {
      id: author.id,
      full_name: author.full_name,
      avatar_url: author.avatar_url,
    } : { id: post.author_id, full_name: 'Usuario', avatar_url: null },
    group: group ? { id: group.id, name: group.name } : null,
  };
}

async function resolveCommentWithAuthor(comment: any): Promise<any> {
  const database = await initDB();
  const author = database.users.find((u: any) => u.id === comment.author_id);

  return {
    ...comment,
    author_name: author?.full_name || 'Usuario',
    author_avatar: author?.avatar_url || 'https://i.pravatar.cc/150',
  };
}

// ─── RESET ─────────────────────────────────────────────────

async function resetDatabase(): Promise<void> {
  db = null;
  await AsyncStorage.removeItem(DB_KEY);
  await initDB();
}

// ─── PUBLIC API ────────────────────────────────────────────

export const localDB = {
  init: initDB,
  persist,
  reset: resetDatabase,
  generateId,

  // Collections
  users: createCollection<any>('users'),
  posts: createCollection<any>('posts'),
  comments: createCollection<any>('comments'),
  news: createCollection<any>('news'),
  ads: createCollection<any>('ads'),
  channels: createCollection<any>('channels'),
  groups: createCollection<any>('groups'),
  prizes: createCollection<any>('prizes'),
  bets: createCollection<any>('bets'),
  media_vault: createCollection<any>('media_vault'),
  user_subscriptions: createCollection<any>('user_subscriptions'),

  // Specialized
  relationships: relationshipsAccess,
  chats: chatsAccess,

  // Join helpers
  resolvePostWithAuthor,
  resolveCommentWithAuthor,
};

export default localDB;
