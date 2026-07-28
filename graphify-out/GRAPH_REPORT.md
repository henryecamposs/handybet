# Graph Report - .  (2026-07-26)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 738 nodes · 1574 edges · 74 communities (29 shown, 45 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a790818d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useThemeColors
- useHandyBetStore
- useToastStore
- types/handyBet.ts
- [chatId].tsx
- useAppNavigation
- sync-obsidian.js
- expo
- 20260720000000_handybet_master_relational_schema.sql
- package.json
- supabaseClient.ts
- RightSidebarWidgets.tsx
- include
- fetch.js
- scripts/package.json
- dependencies
- reset-project.js
- init-project.js
- init_skill.py
- package_skill.py
- images.d.ts
- 20260722000000_advanced_chat_and_bot_schema.sql
- update_brain.js
- TabContainer.tsx
- 20260720020000_analytics_schema.sql
- metro.config.js
- HandyBonusLogo.tsx
- HandyChatLogo.tsx
- HandyLoveLogo.tsx
- HandyNewsLogo.tsx
- HandyPayLogo.tsx
- HandyPlayLogo.tsx
- HandyRoomLogo.tsx
- HandyShowLogo.tsx
- HandyStoreLogo.tsx
- eslint.config.js
- react-native-qrcode-svg
- HeroBanner.tsx
- expo
- expo-camera
- expo-clipboard
- expo-constants
- expo-device
- expo-font
- expo-glass-effect
- expo-image
- expo-image-picker
- expo-linking
- expo-splash-screen
- expo-status-bar
- expo-symbols
- expo-system-ui
- @expo/ui
- lucide-react-native
- nativewind
- nativewind-env.d.ts
- react-dom
- react-dropzone
- react-native
- @react-native-async-storage/async-storage
- react-native-gesture-handler
- react-native-reanimated
- react-native-safe-area-context
- react-native-screens
- react-native-web
- react-native-worklets
- @supabase/supabase-js
- tailwindcss
- zod
- zustand

## God Nodes (most connected - your core abstractions)
1. `useThemeColors()` - 103 edges
2. `useHandyBetStore` - 53 edges
3. `expo-router` - 48 edges
4. `useToastStore` - 40 edges
5. `localDB` - 34 edges
6. `useAppNavigation()` - 26 edges
7. `IconButton()` - 16 edges
8. `react` - 15 edges
9. `public.profiles` - 15 edges
10. `HubDetailLayout()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `plugins` --extends--> `expo-router`  [EXTRACTED]
  app.json → package.json
- `FollowSuggestionWidget()` --references--> `react`  [EXTRACTED]
  src/components/widgets/RightSidebarWidgets.tsx → package.json
- `QRCameraScanner()` --calls--> `useHandyBetStore`  [EXTRACTED]
  components/betting/QRCameraScanner.tsx → src/store/useHandyBetStore.ts
- `GuardadosDetailScreen()` --references--> `react`  [EXTRACTED]
  src/app/(tabs)/favorites/[id].tsx → package.json
- `GuardadosScreen()` --references--> `react`  [EXTRACTED]
  src/app/(tabs)/favorites/index.tsx → package.json

## Import Cycles
- None detected.

## Communities (74 total, 45 thin omitted)

### Community 0 - "useThemeColors"
Cohesion: 0.05
Nodes (55): expo-router, ChannelDetailScreen(), ChannelsScreen(), FollowChatScreen(), ACTIVE_USERS, ChatInboxScreen(), GuardadosDetailScreen(), GuardadosScreen() (+47 more)

### Community 1 - "useHandyBetStore"
Cohesion: 0.05
Nodes (62): QRCameraScanner(), QRCameraScannerProps, react, react, DashboardLayout(), TaquillaScreen(), queryClient, RootLayout() (+54 more)

### Community 2 - "useToastStore"
Cohesion: 0.05
Nodes (50): LoginScreen(), FeedScreen(), allDraws, GameDetailScreen(), TabsLayout(), PostActionButton(), PostActionButtonProps, PostActionButtons() (+42 more)

### Community 3 - "types/handyBet.ts"
Cohesion: 0.06
Nodes (38): MonetizacionAdsScreen(), ThermalReceiptCardProps, MediaVaultGridProps, { width }, adRegistrationSchema, betPayloadSchema, mediaPlanSchema, databaseService (+30 more)

### Community 4 - "[chatId].tsx"
Cohesion: 0.11
Nodes (23): BotActionBar(), BotActionBarProps, InteractiveButtonsGroupProps, MessageContainer(), MessageContainerProps, MessageProps, BotFlowEngine, salesErpBotDefinition (+15 more)

### Community 5 - "useAppNavigation"
Cohesion: 0.10
Nodes (16): AdminLayout(), AdminLogin(), columnHelper, columns, ChatDetailScreen(), AdminWrapper(), PostContainer(), PopoverItem (+8 more)

### Community 6 - "sync-obsidian.js"
Cohesion: 0.08
Nodes (20): brainArch, brainDecisions, brainDomain, brainNotes, brainRoadmap, brainState, brainStyles, changelogPath (+12 more)

### Community 7 - "expo"
Cohesion: 0.08
Nodes (24): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, reactCompiler, typedRoutes (+16 more)

### Community 8 - "20260720000000_handybet_master_relational_schema.sql"
Cohesion: 0.24
Nodes (20): public.bets, public.channels, public.conversation_participants, public.conversations, public.follower_circle_memberships, public.follower_circles, public.groups, public.media_vault_items (+12 more)

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): eslint, eslint-config-expo, devDependencies, eslint, eslint-config-expo, @types/react, typescript, main (+12 more)

### Community 10 - "supabaseClient.ts"
Cohesion: 0.18
Nodes (10): UseStorageOptions, ssrSafeStorage, supabase, authService, AuthSessionUser, recommendationService, SuggestedUser, StorageBucket (+2 more)

### Community 11 - "RightSidebarWidgets.tsx"
Cohesion: 0.14
Nodes (7): HandyAdsLogoProps, HandyAdsLogoSize, FollowSuggestionWidget(), getRelativeTime(), [mockAds, mockNews, mockFollowSuggestions, mockPrizes], RightSidebarWidgets(), RightSidebarWidgetsProps

### Community 12 - "include"
Cohesion: 0.14
Nodes (13): ./assets/*, expo-env.d.ts, expo/tsconfig.base, .expo/types/**/*.ts, nativewind-env.d.ts, **/*.ts, **/*.tsx, compilerOptions (+5 more)

### Community 13 - "fetch.js"
Cohesion: 0.26
Nodes (10): CACHE_DIRECTORY, fetchCached(), getExpires(), hashUrl(), loadCacheEntry(), parseMaxAge(), saveCacheEntry(), fetchSchema() (+2 more)

### Community 14 - "scripts/package.json"
Cohesion: 0.17
Nodes (11): dependencies, ajv, ajv-formats, js-yaml, name, private, type, version (+3 more)

### Community 15 - "dependencies"
Cohesion: 0.20
Nodes (10): ansi-escapes, expo-web-browser, dependencies, ansi-escapes, expo-router, expo-web-browser, @tanstack/react-query, @tanstack/react-table (+2 more)

### Community 16 - "reset-project.js"
Cohesion: 0.22
Nodes (7): exampleDirPath, fs, oldDirs, path, readline, rl, root

### Community 17 - "init-project.js"
Cohesion: 0.33
Nodes (6): copyDir(), getFileHash(), globalSkills, LOCAL_SKILLS_DIR, LOCAL_WORKFLOWS_DIR, localProjectDir

### Community 18 - "init_skill.py"
Cohesion: 0.38
Nodes (6): init_skill(), main(), # TODO: Add actual script logic here, Convert hyphenated skill name to Title Case for display., Initialize a new skill directory with template SKILL.md.      Args:         s, title_case_skill_name()

### Community 19 - "package_skill.py"
Cohesion: 0.43
Nodes (5): main(), package_skill(), Package a skill folder into a .skill file.      Args:         skill_path: Pat, Basic validation of a skill, validate_skill()

### Community 20 - "images.d.ts"
Cohesion: 0.33
Nodes (5): *.gif, *.jpeg, *.jpg, *.png, *.svg

### Community 21 - "20260722000000_advanced_chat_and_bot_schema.sql"
Cohesion: 0.53
Nodes (4): public.bot_session_states, public.conversation_participants, public.conversations, public.messages

### Community 22 - "update_brain.js"
Cohesion: 0.40
Nodes (4): ARCH_FILE, __dirname, __filename, LOG_FILE

### Community 25 - "metro.config.js"
Cohesion: 0.50
Nodes (3): config, { getDefaultConfig }, { withNativeWind }

### Community 36 - "react-native-qrcode-svg"
Cohesion: 0.67
Nodes (3): react-native-qrcode-svg, react-native-svg, react-native-svg

## Knowledge Gaps
- **249 isolated node(s):** `CACHE_DIRECTORY`, `name`, `version`, `private`, `type` (+244 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `expo-router` connect `useThemeColors` to `useHandyBetStore`, `useToastStore`, `[chatId].tsx`, `useAppNavigation`, `expo`, `dependencies`?**
  _High betweenness centrality (0.191) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `useHandyBetStore`, `package.json`, `react-native-qrcode-svg`, `expo`, `expo-camera`, `expo-clipboard`, `expo-constants`, `expo-device`, `expo-font`, `expo-glass-effect`, `expo-image`, `expo-image-picker`, `expo-linking`, `expo-splash-screen`, `expo-status-bar`, `expo-symbols`, `expo-system-ui`, `@expo/ui`, `lucide-react-native`, `nativewind`, `react-dom`, `react-dropzone`, `react-native`, `@react-native-async-storage/async-storage`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`, `react-native-web`, `react-native-worklets`, `@supabase/supabase-js`, `tailwindcss`, `zod`, `zustand`?**
  _High betweenness centrality (0.181) - this node is a cross-community bridge._
- **Why does `useThemeColors()` connect `useThemeColors` to `useHandyBetStore`, `useToastStore`, `[chatId].tsx`, `useAppNavigation`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `CACHE_DIRECTORY`, `name`, `version` to the rest of the system?**
  _249 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useThemeColors` be split into smaller, more focused modules?**
  _Cohesion score 0.053775965831877305 - nodes in this community are weakly interconnected._
- **Should `useHandyBetStore` be split into smaller, more focused modules?**
  _Cohesion score 0.05049088359046283 - nodes in this community are weakly interconnected._
- **Should `useToastStore` be split into smaller, more focused modules?**
  _Cohesion score 0.05160628844839371 - nodes in this community are weakly interconnected._