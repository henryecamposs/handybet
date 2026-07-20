export type HandyBetRole = 'player' | 'cashier' | 'company_owner' | 'admin';
export type HandyBetGroupType = 'apuestas' | 'pronosticos' | 'publicidad' | 'compartir_media';
export type HandyBetBetStatus = 'pendiente' | 'confirmada' | 'ganadora' | 'perdedora' | 'cobrada';
export type HandyBetTxType = 'deposito' | 'retiro' | 'debito_apuesta' | 'credito_premio' | 'compra_suscripcion';
export type HandyBetTxStatus = 'pendiente' | 'aprobado' | 'rechazado';

export interface Profile {
  id: string; // UUID
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: HandyBetRole;
  interests: string[]; // ['apuestas', 'pronosticos', 'publicidad', 'compartir_media']
  created_at: string;
}

export interface Channel {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface Group {
  id: string;
  channel_id: string;
  short_code: string;
  name: string;
  type: HandyBetGroupType;
  config: Record<string, any>;
  members?: string[];
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  group_id: string;
  balance: number;
  created_at: string;
}

export interface BetSelection {
  number: string;
  multiplier: number;
}

export interface BetData {
  lotteryId: string;
  schedule: string;
  gameType: 'triple' | 'terminal' | 'animalito' | 'permuta';
  selections: BetSelection[];
  totalAmount: number;
}

export interface Bet {
  id: string;
  group_id: string;
  user_id: string;
  bet_code: string;
  bet_data: BetData;
  amount: number;
  potential_prize: number;
  status: HandyBetBetStatus;
  ticket_number?: string;
  payment_proof_url?: string;
  processed_by: string | null;
  created_at: string;
}

export interface MediaPlan {
  id: string;
  group_id: string;
  name: string;
  price: number;
  max_photos: number;
  max_videos: number;
  duration_days: number;
  created_at: string;
}

export interface MediaVaultItem {
  id: string;
  group_id: string;
  plan_id: string | null;
  title: string;
  media_type: 'photo' | 'video';
  storage_url: string;
  preview_url: string | null;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  expires_at: string;
  is_active: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: HandyBetTxType;
  status: HandyBetTxStatus;
  reference_code: string | null;
  receipt_image_url: string | null;
  processed_by: string | null;
  created_at: string;
}

export interface Advertisement {
  id: string;
  channel_id: string;
  business_name: string;
  business_rif: string;
  business_contact: string;
  ad_copy: string;
  media_url: string;
  target_deeplink: string | null;
  cost_amount: number;
  is_active: boolean;
  created_at: string;
}

// Contratos del núcleo de red social monetizada
export type VisibilityLevel = 'todos' | 'seguidores' | 'circulo';
export type BillingType = 'pay_per_action' | '24_hours' | 'mensual' | 'anual';
export type MembershipStatus = 'onboarding_pending' | 'active' | 'blocked';
export type PostType = 'regular' | 'advertisement';
export type PaymentStatus = 'none_required' | 'pendiente_pago' | 'pagado';

export interface GroupPlan {
  id: string;
  group_id: string;
  name: string;
  price: number;
  billing_type: BillingType;
  created_at: string;
}

export interface GroupRules {
  id: string;
  group_id: string;
  permitir_publicar_feeds: boolean;
  permitir_publicar_publicidad: boolean;
  terms_text: string;
  onboarding_questionnaire: {
    questions: Array<{ id: string; question: string; required: boolean }>;
  };
  pay_to_post_enabled: boolean;
  pay_to_post_fee: number;
}

export interface Membership {
  id: string;
  group_id: string;
  user_id: string;
  plan_id: string | null;
  status: MembershipStatus;
  onboarding_answers: Record<string, string>;
  valid_until: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  author?: {
    id: string;
    full_name: string;
    avatar_url?: string | null;
  };
  group_id: string | null;
  group?: {
    id: string;
    name: string;
  } | null;
  channel_id?: string | null;
  channel?: {
    id: string;
    name: string;
  } | null;
  content: string;
  media_url?: string | null;
  media_type?: 'photo' | 'video' | null;
  visibility_level: VisibilityLevel;
  circle_id?: string | null;
  post_type: PostType;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
}


export interface UserRelationship {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface FollowerCircle {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
}

export interface FollowerCircleMembership {
  circle_id: string;
  follower_id: string;
  owner_id: string;
  created_at: string;
}

