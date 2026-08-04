import { VisualStackPluginSDK } from '../sdk/VisualStackPluginSDK';

export interface MarketplacePlugin {
  id: string;
  name: string;
  version: string;
  author: string;
  rating: number;
  downloads: number;
  category: 'UI Kits & Figma' | 'Editor Extensions' | 'Backend Connectors' | 'AI & Copilots' | 'Themes' | 'DevOps & Cloud';
  description: string;
  tags: string[];
  isInstalled: boolean;
  isEnabled: boolean;
}

const REAL_PLUGINS_DATA: MarketplacePlugin[] = [
  // ==================== 1. UI KITS & FIGMA (20 Plugins) ====================
  { id: 'plug_figma_tokens', name: 'Figma Tokens Sync', version: '2.5.1', author: 'Figma Community', rating: 4.9, downloads: 84200, category: 'UI Kits & Figma', description: 'Bi-directional sync between Figma design tokens, auto-layout variants, and VisualStack CSS tokens.', tags: ['figma', 'tokens', 'styles'], isInstalled: true, isEnabled: true },
  { id: 'plug_tailwind_ui', name: 'Tailwind CSS IntelliSense', version: '3.4.2', author: 'Tailwind Labs', rating: 4.9, downloads: 142000, category: 'UI Kits & Figma', description: 'Intelligent class autocomplete, color previews, and linting for Tailwind CSS in canvas widgets.', tags: ['tailwind', 'css', 'autocomplete'], isInstalled: true, isEnabled: true },
  { id: 'plug_material_ui', name: 'MUI v5 Component Kit', version: '5.15.0', author: 'MUI Official', rating: 4.8, downloads: 96500, category: 'UI Kits & Figma', description: 'Complete Google Material Design 3 UI component set including buttons, dialogs, sliders, and cards.', tags: ['material', 'mui', 'components'], isInstalled: false, isEnabled: false },
  { id: 'plug_shadcn_ui', name: 'shadcn/ui Component Palette', version: '1.2.0', author: 'shadcn', rating: 4.9, downloads: 115000, category: 'UI Kits & Figma', description: 'Copy-paste beautiful accessible Radix UI & Tailwind CSS elements directly onto canvas.', tags: ['shadcn', 'radix', 'react'], isInstalled: true, isEnabled: true },
  { id: 'plug_lucide_icons', name: 'Lucide Icon Pack 1000+', version: '0.350.0', author: 'Lucide Project', rating: 4.9, downloads: 160000, category: 'UI Kits & Figma', description: '1000+ modern SVG icons with configurable stroke width, fill, and vector color support.', tags: ['icons', 'svg', 'lucide'], isInstalled: true, isEnabled: true },
  { id: 'plug_framer_motion', name: 'Framer Motion Animator', version: '11.0.8', author: 'Framer', rating: 4.8, downloads: 78000, category: 'UI Kits & Figma', description: 'Drag-and-drop animation curves, spring physics, and hover/click keyframe effects.', tags: ['animation', 'motion', 'framer'], isInstalled: false, isEnabled: false },
  { id: 'plug_heroicons', name: 'Tailwind Heroicons v2', version: '2.1.1', author: 'Tailwind Labs', rating: 4.7, downloads: 65000, category: 'UI Kits & Figma', description: 'Official hand-crafted solid and outline SVG icon set for modern web interfaces.', tags: ['heroicons', 'svg'], isInstalled: false, isEnabled: false },
  { id: 'plug_chakra_ui', name: 'Chakra UI Pro Widgets', version: '2.8.2', author: 'Chakra Team', rating: 4.7, downloads: 52000, category: 'UI Kits & Figma', description: 'Modular, accessible React components with dark mode and theme token binding.', tags: ['chakra', 'react'], isInstalled: false, isEnabled: false },
  { id: 'plug_ant_design', name: 'Ant Design 5.0 Enterprise UI', version: '5.12.0', author: 'Ant Financial', rating: 4.8, downloads: 110000, category: 'UI Kits & Figma', description: 'Enterprise-class React UI component library for complex admin dashboards and tables.', tags: ['ant-design', 'enterprise', 'table'], isInstalled: false, isEnabled: false },
  { id: 'plug_lottie_animations', name: 'Lottie interactive Vector Animations', version: '2.0.1', author: 'LottieFiles', rating: 4.9, downloads: 135000, category: 'UI Kits & Figma', description: 'Embed interactive Lottie JSON animations with cursor hover and scroll triggers.', tags: ['lottie', 'vector', 'animation'], isInstalled: true, isEnabled: true },
  { id: 'plug_google_fonts', name: 'Google Fonts Typography Sync', version: '4.0.0', author: 'Google Fonts', rating: 4.9, downloads: 190000, category: 'UI Kits & Figma', description: 'Access 1400+ web fonts directly in font selection dropdowns with live rendering.', tags: ['fonts', 'typography', 'google'], isInstalled: true, isEnabled: true },
  { id: 'plug_font_awesome', name: 'FontAwesome Pro 6.5', version: '6.5.1', author: 'Fonticons Inc', rating: 4.8, downloads: 175000, category: 'UI Kits & Figma', description: 'Over 20,000+ vector icons across solid, regular, light, thin, and duotone styles.', tags: ['fontawesome', 'icons', 'pro'], isInstalled: false, isEnabled: false },
  { id: 'plug_radix_primitives', name: 'Radix UI Headless Primitives', version: '1.0.3', author: 'WorkOS', rating: 4.9, downloads: 88000, category: 'UI Kits & Figma', description: 'Unstyled, accessible UI components for building high-quality design systems.', tags: ['radix', 'headless', 'a11y'], isInstalled: false, isEnabled: false },
  { id: 'plug_nextui', name: 'NextUI Heroic Components', version: '2.2.9', author: 'NextUI Org', rating: 4.8, downloads: 72000, category: 'UI Kits & Figma', description: 'Beautiful, fast and modern React UI library built on top of Tailwind CSS.', tags: ['nextui', 'tailwind', 'modern'], isInstalled: false, isEnabled: false },
  { id: 'plug_bootstrap5', name: 'Bootstrap 5.3 Vector Toolkit', version: '5.3.2', author: 'Bootstrap Core', rating: 4.6, downloads: 140000, category: 'UI Kits & Figma', description: 'Classic grid systems, flexbox utilities, badges, tooltips, and responsive modals.', tags: ['bootstrap', 'css', 'grid'], isInstalled: false, isEnabled: false },
  { id: 'plug_mantine_ui', name: 'Mantine UI v7 Suite', version: '7.5.0', author: 'Mantine Team', rating: 4.9, downloads: 64000, category: 'UI Kits & Figma', description: '100+ customizable components and hooks with built-in dark theme support.', tags: ['mantine', 'hooks', 'react'], isInstalled: false, isEnabled: false },
  { id: 'plug_tabler_icons', name: 'Tabler Icons 3000+', version: '3.1.0', author: 'Paweł Kuna', rating: 4.8, downloads: 58000, category: 'UI Kits & Figma', description: 'Free and open source stroke SVG icons tailored for web apps and mobile UI.', tags: ['tabler', 'icons', 'svg'], isInstalled: false, isEnabled: false },
  { id: 'plug_phosphor_icons', name: 'Phosphor Icons Pack', version: '2.1.0', author: 'Phosphor', rating: 4.9, downloads: 82000, category: 'UI Kits & Figma', description: 'Flexible icon family for interfaces, diagrams, presentation slides, and print.', tags: ['phosphor', 'icons'], isInstalled: false, isEnabled: false },
  { id: 'plug_semantic_ui', name: 'Semantic UI React Widgets', version: '2.1.5', author: 'Semantic Org', rating: 4.5, downloads: 49000, category: 'UI Kits & Figma', description: 'User interface framework that uses human-friendly HTML syntax.', tags: ['semantic', 'html'], isInstalled: false, isEnabled: false },
  { id: 'plug_blueprint_ui', name: 'Blueprint JS Desktop Toolkit', version: '5.8.0', author: 'Palantir', rating: 4.7, downloads: 38000, category: 'UI Kits & Figma', description: 'React-based UI toolkit for building complex data-dense interfaces on desktop.', tags: ['blueprint', 'palantir', 'desktop'], isInstalled: false, isEnabled: false },

  // ==================== 2. EDITOR EXTENSIONS (20 Plugins) ====================
  { id: 'plug_prettier', name: 'Prettier Code Formatter', version: '10.1.0', author: 'Prettier Core', rating: 4.9, downloads: 280000, category: 'Editor Extensions', description: 'Opinionated code formatter for JS, TS, HTML, CSS, JSON, and React code blocks.', tags: ['formatter', 'prettier', 'code'], isInstalled: true, isEnabled: true },
  { id: 'plug_eslint', name: 'ESLint Code Linter', version: '8.57.0', author: 'ESLint Team', rating: 4.9, downloads: 260000, category: 'Editor Extensions', description: 'Integrates ESLint into VisualStack code editor to highlight syntax and logical errors.', tags: ['linter', 'eslint', 'errors'], isInstalled: true, isEnabled: true },
  { id: 'plug_gitlens', name: 'GitLens Supercharged Git', version: '15.0.1', author: 'GitKraken', rating: 4.9, downloads: 195000, category: 'Editor Extensions', description: 'Inline git blame annotations, revision navigation, commit history graph, and diff view.', tags: ['git', 'blame', 'history'], isInstalled: true, isEnabled: true },
  { id: 'plug_error_lens', name: 'Error Lens Highlighter', version: '3.16.0', author: 'Alexander', rating: 4.8, downloads: 128000, category: 'Editor Extensions', description: 'Highlights error, warning, and diagnostic lines directly in Monaco code editor with inline message.', tags: ['errors', 'monaco'], isInstalled: false, isEnabled: false },
  { id: 'plug_auto_rename_tag', name: 'Auto Rename Tag', version: '0.1.10', author: 'Jun Han', rating: 4.7, downloads: 140000, category: 'Editor Extensions', description: 'Automatically rename paired HTML/JSX tags in code editor simultaneously.', tags: ['html', 'jsx', 'tags'], isInstalled: true, isEnabled: true },
  { id: 'plug_bracket_pair', name: 'Rainbow Brackets Colorizer', version: '2.0.4', author: 'CoenraadS', rating: 4.8, downloads: 175000, category: 'Editor Extensions', description: 'Colorizes matching brackets for nesting clarity in JavaScript and JSON files.', tags: ['brackets', 'colors'], isInstalled: true, isEnabled: true },
  { id: 'plug_path_intellisense', name: 'Path IntelliSense', version: '2.8.5', author: 'Christian Kohler', rating: 4.7, downloads: 110000, category: 'Editor Extensions', description: 'Autocompletes file path imports and asset URIs as you type code.', tags: ['imports', 'paths'], isInstalled: false, isEnabled: false },
  { id: 'plug_live_server', name: 'Live Preview Local Server', version: '0.4.7', author: 'Microsoft', rating: 4.8, downloads: 210000, category: 'Editor Extensions', description: 'Embedded browser preview with instant hot-reload on every canvas or code modification.', tags: ['server', 'preview', 'hot-reload'], isInstalled: true, isEnabled: true },
  { id: 'plug_indent_rainbow', name: 'Indent Rainbow Indentation', version: '8.3.0', author: 'oderwat', rating: 4.8, downloads: 95000, category: 'Editor Extensions', description: 'Colorizes indentation levels alternating 4 different colors on each step.', tags: ['indentation', 'code'], isInstalled: false, isEnabled: false },
  { id: 'plug_import_cost', name: 'Import Cost Bundle Inspector', version: '3.3.0', author: 'Wix', rating: 4.8, downloads: 105000, category: 'Editor Extensions', description: 'Displays inline calculated bundle file size for imported npm modules in Monaco code view.', tags: ['npm', 'bundle', 'size'], isInstalled: true, isEnabled: true },
  { id: 'plug_code_spell_checker', name: 'Code Spell Checker', version: '3.0.1', author: 'Street Side Software', rating: 4.7, downloads: 130000, category: 'Editor Extensions', description: 'Source code spell checker that catches common typos in identifiers and strings.', tags: ['spellcheck', 'typo'], isInstalled: false, isEnabled: false },
  { id: 'plug_todo_highlight', name: 'TODO Highlight Manager', version: '1.0.5', author: 'Wayou Liu', rating: 4.7, downloads: 82000, category: 'Editor Extensions', description: 'Highlights TODO, FIXME and custom annotations in source code files.', tags: ['todo', 'comments'], isInstalled: false, isEnabled: false },
  { id: 'plug_css_peek', name: 'CSS Peek & Class Definition', version: '4.4.1', author: 'Pranay Prakash', rating: 4.8, downloads: 74000, category: 'Editor Extensions', description: 'Allow peeking to CSS ID and class definitions directly from JSX and HTML code.', tags: ['css', 'peek', 'html'], isInstalled: false, isEnabled: false },
  { id: 'plug_change_case', name: 'Change Case Transformer', version: '1.0.0', author: 'wmaurer', rating: 4.6, downloads: 68000, category: 'Editor Extensions', description: 'Transform text case quickly (camelCase, CONSTANT_CASE, kebab-case, PascalCase).', tags: ['case', 'text'], isInstalled: false, isEnabled: false },
  { id: 'plug_bookmark_manager', name: 'Bookmarks & Quick Code Jump', version: '13.5.0', author: 'Alessandro Fragnani', rating: 4.8, downloads: 91000, category: 'Editor Extensions', description: 'Mark important code lines and jump between bookmarks across workspace files.', tags: ['bookmarks', 'jump'], isInstalled: false, isEnabled: false },
  { id: 'plug_vow_coverage', name: 'Code Coverage Visualizer', version: '2.5.0', author: 'Ryan Luker', rating: 4.7, downloads: 44000, category: 'Editor Extensions', description: 'Highlights unit test code coverage lines (green covered, red uncovered).', tags: ['tests', 'coverage'], isInstalled: false, isEnabled: false },
  { id: 'plug_monaco_vim', name: 'Vim Keybindings Emulation', version: '1.26.0', author: 'Vim Team', rating: 4.9, downloads: 112000, category: 'Editor Extensions', description: 'Full Vim modal editing emulation (Normal, Insert, Visual mode) for keyboard power users.', tags: ['vim', 'keybindings'], isInstalled: false, isEnabled: false },
  { id: 'plug_emmet', name: 'Emmet Abbreviation Expander', version: '2.1.0', author: 'Emmet.io', rating: 4.9, downloads: 230000, category: 'Editor Extensions', description: 'High-speed HTML & CSS snippet expansion via shorthand abbreviations.', tags: ['emmet', 'snippets'], isInstalled: true, isEnabled: true },
  { id: 'plug_json_to_ts', name: 'JSON to TypeScript Interfaces', version: '1.7.0', author: 'Gregor Adams', rating: 4.8, downloads: 77000, category: 'Editor Extensions', description: 'Instantly convert JSON payload strings into strongly-typed TypeScript interfaces.', tags: ['json', 'typescript'], isInstalled: true, isEnabled: true },
  { id: 'plug_graphql_tools', name: 'GraphQL Syntax & Linter', version: '1.0.8', author: 'GraphQL Foundation', rating: 4.7, downloads: 53000, category: 'Editor Extensions', description: 'Syntax highlighting, validation, and auto-complete for .graphql schema files.', tags: ['graphql', 'syntax'], isInstalled: false, isEnabled: false },

  // ==================== 3. BACKEND CONNECTORS (20 Plugins) ====================
  { id: 'plug_stripe', name: 'Stripe Payments Suite', version: '2.4.0', author: 'Stripe Official', rating: 4.9, downloads: 142000, category: 'Backend Connectors', description: 'Checkout webhooks, subscription billing, refund nodes, and payment intent nodes.', tags: ['stripe', 'payments', 'billing'], isInstalled: true, isEnabled: true },
  { id: 'plug_supabase', name: 'Supabase Database & Auth', version: '1.8.2', author: 'Supabase Inc', rating: 4.9, downloads: 189000, category: 'Backend Connectors', description: 'Realtime Postgres subscriptions, Row Level Security rules, Auth, and Storage buckets.', tags: ['supabase', 'postgres', 'auth'], isInstalled: true, isEnabled: true },
  { id: 'plug_firebase', name: 'Firebase Admin & Firestore', version: '10.8.0', author: 'Google Cloud', rating: 4.8, downloads: 156000, category: 'Backend Connectors', description: 'Cloud Firestore database queries, Firebase Auth triggers, and Cloud Functions.', tags: ['firebase', 'google', 'nosql'], isInstalled: false, isEnabled: false },
  { id: 'plug_prisma', name: 'Prisma ORM Generator', version: '5.10.0', author: 'Prisma Data Inc', rating: 4.9, downloads: 132000, category: 'Backend Connectors', description: 'Visual data modeler, schema migrations, and type-safe database query nodes.', tags: ['prisma', 'orm', 'database'], isInstalled: true, isEnabled: true },
  { id: 'plug_redis', name: 'Redis Caching & PubSub', version: '4.6.0', author: 'Redis Ltd', rating: 4.8, downloads: 88000, category: 'Backend Connectors', description: 'In-memory KV caching, key expiration, rate limiting, and PubSub message queues.', tags: ['redis', 'cache', 'queue'], isInstalled: false, isEnabled: false },
  { id: 'plug_graphql', name: 'Apollo GraphQL Engine', version: '3.9.0', author: 'Apollo GraphQL', rating: 4.8, downloads: 74000, category: 'Backend Connectors', description: 'Auto-generate GraphQL schemas, resolvers, and Apollo Client hooks.', tags: ['graphql', 'apollo', 'api'], isInstalled: false, isEnabled: false },
  { id: 'plug_postman', name: 'Postman API Tester', version: '2.1.0', author: 'Postman', rating: 4.9, downloads: 198000, category: 'Backend Connectors', description: 'Import Postman collections, run API test suites, and mock REST endpoints.', tags: ['postman', 'rest', 'api'], isInstalled: true, isEnabled: true },
  { id: 'plug_twilio', name: 'Twilio SMS & Whatsapp API', version: '4.2.0', author: 'Twilio', rating: 4.7, downloads: 62000, category: 'Backend Connectors', description: 'Send SMS notifications, 2FA verification codes, and WhatsApp messages.', tags: ['twilio', 'sms', 'auth'], isInstalled: false, isEnabled: false },
  { id: 'plug_mongodb', name: 'MongoDB Mongoose Connector', version: '8.2.0', author: 'MongoDB Inc', rating: 4.8, downloads: 165000, category: 'Backend Connectors', description: 'BSON document modeling, aggregation pipelines, and MongoDB Atlas cloud sync.', tags: ['mongodb', 'nosql', 'mongoose'], isInstalled: true, isEnabled: true },
  { id: 'plug_sendgrid', name: 'SendGrid Email API', version: '7.7.0', author: 'Twilio SendGrid', rating: 4.8, downloads: 92000, category: 'Backend Connectors', description: 'Transactional emails, HTML newsletter templates, and delivery status webhooks.', tags: ['sendgrid', 'email', 'smtp'], isInstalled: false, isEnabled: false },
  { id: 'plug_algolia', name: 'Algolia Search Indexer', version: '4.20.0', author: 'Algolia', rating: 4.9, downloads: 78000, category: 'Backend Connectors', description: 'Instant search autocomplete indexing, typo tolerance, and faceted filtering.', tags: ['algolia', 'search', 'index'], isInstalled: false, isEnabled: false },
  { id: 'plug_planetscale', name: 'PlanetScale MySQL Driver', version: '1.14.0', author: 'PlanetScale', rating: 4.8, downloads: 67000, category: 'Backend Connectors', description: 'Non-blocking database branching, schema migrations, and vitess MySQL routing.', tags: ['planetscale', 'mysql', 'db'], isInstalled: false, isEnabled: false },
  { id: 'plug_neo4j', name: 'Neo4j Graph Database', version: '5.17.0', author: 'Neo4j Inc', rating: 4.7, downloads: 41000, category: 'Backend Connectors', description: 'Cypher query execution, social network graphs, and knowledge node relations.', tags: ['neo4j', 'graph', 'cypher'], isInstalled: false, isEnabled: false },
  { id: 'plug_rabbitmq', name: 'RabbitMQ Message Broker', version: '0.9.2', author: 'Pivotal', rating: 4.7, downloads: 56000, category: 'Backend Connectors', description: 'AMQP queue publishing, consumer routing keys, and dead-letter exchanges.', tags: ['rabbitmq', 'amqp', 'queue'], isInstalled: false, isEnabled: false },
  { id: 'plug_kafka', name: 'Apache Kafka Event Streams', version: '2.5.0', author: 'Confluent', rating: 4.8, downloads: 83000, category: 'Backend Connectors', description: 'High-throughput event stream processing, topic partitions, and consumer groups.', tags: ['kafka', 'streaming', 'events'], isInstalled: false, isEnabled: false },
  { id: 'plug_auth0', name: 'Auth0 Identity & SSO', version: '3.3.0', author: 'Okta / Auth0', rating: 4.9, downloads: 124000, category: 'Backend Connectors', description: 'Universal login, OAuth 2.0, SAML 2.0, Multi-Factor Auth, and JWT validation.', tags: ['auth0', 'sso', 'jwt'], isInstalled: true, isEnabled: true },
  { id: 'plug_clerk_auth', name: 'Clerk User Management', version: '4.29.0', author: 'Clerk Dev', rating: 4.9, downloads: 108000, category: 'Backend Connectors', description: 'Pre-built React login buttons, user profile modals, and organization RBAC.', tags: ['clerk', 'auth', 'react'], isInstalled: false, isEnabled: false },
  { id: 'plug_elasticsearch', name: 'Elasticsearch & Kibana', version: '8.12.0', author: 'Elastic', rating: 4.8, downloads: 99000, category: 'Backend Connectors', description: 'Full-text search indexing, log aggregation, and real-time analytical queries.', tags: ['elastic', 'search', 'logs'], isInstalled: false, isEnabled: false },
  { id: 'plug_sentry', name: 'Sentry Error Monitoring', version: '7.100.0', author: 'Sentry.io', rating: 4.9, downloads: 215000, category: 'Backend Connectors', description: 'Real-time crash reports, stack trace capture, and performance tracing.', tags: ['sentry', 'errors', 'monitoring'], isInstalled: true, isEnabled: true },
  { id: 'plug_pusher', name: 'Pusher Realtime WebSockets', version: '5.1.0', author: 'Pusher', rating: 4.8, downloads: 87000, category: 'Backend Connectors', description: 'Publish-subscribe WebSockets, presence channels, and client push events.', tags: ['pusher', 'websockets', 'realtime'], isInstalled: false, isEnabled: false },

  // ==================== 4. AI & COPILOTS (20 Plugins) ====================
  { id: 'plug_openai', name: 'OpenAI GPT-4o & Canvas AI', version: '1.4.0', author: 'OpenAI', rating: 4.9, downloads: 310000, category: 'AI & Copilots', description: 'Advanced streaming LLM prompts, visual wireframe parsing, and multi-step fullstack creation.', tags: ['openai', 'gpt4', 'copilot'], isInstalled: true, isEnabled: true },
  { id: 'plug_anthropic', name: 'Claude 3.5 Sonnet Engineer', version: '2.1.0', author: 'Anthropic', rating: 4.9, downloads: 245000, category: 'AI & Copilots', description: 'Deep architectural reasoning, refactoring, code explanation, and bug fixing.', tags: ['claude', 'anthropic', 'ai'], isInstalled: true, isEnabled: true },
  { id: 'plug_deepseek', name: 'DeepSeek R1 Reasoner', version: '1.0.2', author: 'DeepSeek AI', rating: 4.9, downloads: 185000, category: 'AI & Copilots', description: 'Ultra-fast math logic, state machine generation, and algorithm optimizer.', tags: ['deepseek', 'reasoning'], isInstalled: true, isEnabled: true },
  { id: 'plug_ollama', name: 'Ollama Local LLM Connector', version: '0.5.1', author: 'Ollama Community', rating: 4.8, downloads: 140000, category: 'AI & Copilots', description: 'Run Qwen2.5-Coder and Llama3 offline on your GPU without cloud API costs.', tags: ['ollama', 'local', 'gpu'], isInstalled: true, isEnabled: true },
  { id: 'plug_copilot_voice', name: 'Voice Copilot Assistant', version: '1.1.0', author: 'VisualStack AI', rating: 4.7, downloads: 54000, category: 'AI & Copilots', description: 'Speech-to-text dictation to design canvas screens and generate backend workflows by voice.', tags: ['voice', 'speech', 'ai'], isInstalled: false, isEnabled: false },
  { id: 'plug_gemini_pro', name: 'Google Gemini 1.5 Pro', version: '1.5.0', author: 'Google DeepMind', rating: 4.9, downloads: 230000, category: 'AI & Copilots', description: '1 Million token context window for full codebase reasoning and multimodal vision.', tags: ['gemini', 'google', 'deepmind'], isInstalled: true, isEnabled: true },
  { id: 'plug_groq_llama', name: 'Groq Llama 3.3 70B Ultra-Fast', version: '3.3.0', author: 'Groq Cloud', rating: 4.9, downloads: 165000, category: 'AI & Copilots', description: '500+ tokens/sec inference speed powered by Groq LPU inference engine.', tags: ['groq', 'llama3', 'fast'], isInstalled: false, isEnabled: false },
  { id: 'plug_mistral_ai', name: 'Mistral Large 2 & Codestral', version: '2.0.0', author: 'Mistral AI', rating: 4.8, downloads: 120000, category: 'AI & Copilots', description: 'State-of-the-art European open weights LLM for code generation and inline completion.', tags: ['mistral', 'codestral'], isInstalled: false, isEnabled: false },
  { id: 'plug_cohere_command', name: 'Cohere Command R+', version: '4.1.0', author: 'Cohere', rating: 4.7, downloads: 72000, category: 'AI & Copilots', description: 'Optimized for RAG enterprise search, web grounding, and structured JSON output.', tags: ['cohere', 'rag', 'search'], isInstalled: false, isEnabled: false },
  { id: 'plug_huggingface', name: 'Hugging Face Inference Hub', version: '0.21.0', author: 'Hugging Face', rating: 4.8, downloads: 150000, category: 'AI & Copilots', description: 'Access over 100,000+ open source transformer models via direct API calls.', tags: ['huggingface', 'transformers'], isInstalled: false, isEnabled: false },
  { id: 'plug_midjourney_ui', name: 'AI Image Generator (FLUX.1)', version: '1.0.4', author: 'Black Forest Labs', rating: 4.9, downloads: 180000, category: 'AI & Copilots', description: 'Generate high-resolution UI mockup images and hero illustrations from text prompts.', tags: ['flux', 'image', 'generation'], isInstalled: true, isEnabled: true },
  { id: 'plug_elevenlabs', name: 'ElevenLabs Text-to-Speech', version: '2.3.0', author: 'ElevenLabs', rating: 4.9, downloads: 95000, category: 'AI & Copilots', description: 'Lifelike voice synthesis for audio previews, interactive tutorials, and voice bots.', tags: ['elevenlabs', 'tts', 'audio'], isInstalled: false, isEnabled: false },
  { id: 'plug_pinecone_vector', name: 'Pinecone Vector DB Connector', version: '3.0.1', author: 'Pinecone Systems', rating: 4.8, downloads: 88000, category: 'AI & Copilots', description: 'Vector embeddings storage, similarity search, and semantic knowledge retrieval.', tags: ['pinecone', 'vector', 'embeddings'], isInstalled: false, isEnabled: false },
  { id: 'plug_chromadb', name: 'ChromaDB Local Vector DB', version: '0.4.22', author: 'Chroma', rating: 4.8, downloads: 71000, category: 'AI & Copilots', description: 'Open-source local vector database for AI embeddings without cloud setup.', tags: ['chroma', 'vector', 'local'], isInstalled: false, isEnabled: false },
  { id: 'plug_langchain', name: 'LangChain Agent Chains', version: '0.1.9', author: 'LangChain Org', rating: 4.7, downloads: 145000, category: 'AI & Copilots', description: 'Build autonomous multi-step LLM agents, memory buffers, and tool executors.', tags: ['langchain', 'agents', 'chains'], isInstalled: false, isEnabled: false },
  { id: 'plug_llamaindex', name: 'LlamaIndex RAG Pipeline', version: '0.10.0', author: 'LlamaIndex', rating: 4.8, downloads: 110000, category: 'AI & Copilots', description: 'Data framework for connecting custom PDF documents and database schemas to LLMs.', tags: ['llamaindex', 'rag', 'pdf'], isInstalled: false, isEnabled: false },
  { id: 'plug_replicate', name: 'Replicate Cloud AI Models', version: '0.28.0', author: 'Replicate Inc', rating: 4.8, downloads: 92000, category: 'AI & Copilots', description: 'Run open-source machine learning models with a cloud API endpoint.', tags: ['replicate', 'cloud', 'ml'], isInstalled: false, isEnabled: false },
  { id: 'plug_whisper', name: 'OpenAI Whisper Speech-to-Text', version: '1.0.0', author: 'OpenAI', rating: 4.9, downloads: 160000, category: 'AI & Copilots', description: 'Multilingual audio transcription with automatic timestamp alignment.', tags: ['whisper', 'audio', 'transcribe'], isInstalled: false, isEnabled: false },
  { id: 'plug_code_llama', name: 'Code Llama 70B Complete', version: '70.0.0', author: 'Meta AI', rating: 4.8, downloads: 130000, category: 'AI & Copilots', description: 'Meta open weights model specifically fine-tuned for code synthesis and debugging.', tags: ['meta', 'codellama', 'llama'], isInstalled: false, isEnabled: false },
  { id: 'plug_runway_gen2', name: 'Runway Gen-2 Video Motion', version: '2.0.1', author: 'Runway', rating: 4.7, downloads: 62000, category: 'AI & Copilots', description: 'Generate short video loops and UI micro-animations from text descriptions.', tags: ['runway', 'video', 'animation'], isInstalled: false, isEnabled: false },

  // ==================== 5. THEMES (20 Plugins) ====================
  { id: 'plug_dracula', name: 'Dracula Pro Theme', version: '1.2.0', author: 'Zeno Rocha', rating: 4.9, downloads: 98000, category: 'Themes', description: 'Vibrant dark theme palette crafted for high readability and reduced eye strain.', tags: ['theme', 'dark', 'dracula'], isInstalled: true, isEnabled: true },
  { id: 'plug_one_dark', name: 'One Dark Pro Theme', version: '3.14.0', author: 'binaryify', rating: 4.8, downloads: 180000, category: 'Themes', description: 'Atom classic One Dark color scheme for code editor, canvas, and sidebars.', tags: ['theme', 'one-dark'], isInstalled: false, isEnabled: false },
  { id: 'plug_tokyo_night', name: 'Tokyo Night Theme Pack', version: '1.0.5', author: 'enkia', rating: 4.9, downloads: 125000, category: 'Themes', description: 'Clean dark theme inspired by the lights of Tokyo at night.', tags: ['theme', 'tokyo-night'], isInstalled: true, isEnabled: true },
  { id: 'plug_catppuccin', name: 'Catppuccin Mocha Palette', version: '0.2.0', author: 'Catppuccin Org', rating: 4.9, downloads: 145000, category: 'Themes', description: 'Soothing pastel dark theme with customizable accent highlights.', tags: ['theme', 'catppuccin', 'pastel'], isInstalled: false, isEnabled: false },
  { id: 'plug_github_theme', name: 'GitHub Light & Dark Theme', version: '6.3.4', author: 'GitHub', rating: 4.8, downloads: 220000, category: 'Themes', description: 'Official GitHub default light, dark, and dim color schemes.', tags: ['theme', 'github'], isInstalled: false, isEnabled: false },
  { id: 'plug_nord_theme', name: 'Nord Arctic Ice Theme', version: '0.16.0', author: 'Arctic Ice Studio', rating: 4.9, downloads: 110000, category: 'Themes', description: 'An arctic, north-bluish clean color palette created for optimal focus.', tags: ['nord', 'arctic', 'blue'], isInstalled: false, isEnabled: false },
  { id: 'plug_cyberpunk_neon', name: 'Cyberpunk 2077 Neon Theme', version: '1.4.0', author: 'Max', rating: 4.8, downloads: 95000, category: 'Themes', description: 'High-contrast cyan, yellow, and hot pink neon highlights for night coding.', tags: ['cyberpunk', 'neon'], isInstalled: true, isEnabled: true },
  { id: 'plug_monokai_pro', name: 'Monokai Pro Official Theme', version: '1.8.0', author: 'Monokai', rating: 4.9, downloads: 160000, category: 'Themes', description: 'Professional color scheme and icon theme tuned for coding precision.', tags: ['monokai', 'pro'], isInstalled: false, isEnabled: false },
  { id: 'plug_synthwave_84', name: 'SynthWave 84 Retro Theme', version: '0.1.15', author: 'Robb Owen', rating: 4.9, downloads: 130000, category: 'Themes', description: 'Neon glow 80s retro synthwave theme with neon text glow effects.', tags: ['synthwave', '80s', 'glow'], isInstalled: false, isEnabled: false },
  { id: 'plug_solarized', name: 'Solarized Dark & Light', version: '2.0.2', author: 'Ethan Schoonover', rating: 4.7, downloads: 105000, category: 'Themes', description: 'Precision color palette designed for terminal and graphical applications.', tags: ['solarized', 'palette'], isInstalled: false, isEnabled: false },
  { id: 'plug_palenight', name: 'Material Palenight Theme', version: '2.0.1', author: 'Equinusocio', rating: 4.8, downloads: 88000, category: 'Themes', description: 'An elegant Material Design theme with soft violet and purple tones.', tags: ['palenight', 'material'], isInstalled: false, isEnabled: false },
  { id: 'plug_gruvbox', name: 'Gruvbox Retro Groove', version: '1.2.2', author: 'morhetz', rating: 4.8, downloads: 79000, category: 'Themes', description: 'Retro warm dark/light theme designed to be easy on eyes.', tags: ['gruvbox', 'retro'], isInstalled: false, isEnabled: false },
  { id: 'plug_night_owl', name: 'Night Owl Theme (Sarah Drasner)', version: '2.0.1', author: 'Sarah Drasner', rating: 4.9, downloads: 140000, category: 'Themes', description: 'A VS Code theme for night owls tuned for low-light environments.', tags: ['nightowl', 'sarahdrasner'], isInstalled: false, isEnabled: false },
  { id: 'plug_shades_of_purple', name: 'Shades of Purple Theme', version: '7.1.0', author: 'Ahmad Awais', rating: 4.9, downloads: 115000, category: 'Themes', description: 'A professional theme with bold shades of purple for code components.', tags: ['purple', 'ahmadawais'], isInstalled: false, isEnabled: false },
  { id: 'plug_cobalt2', name: 'Cobalt2 Theme (Wes Bos)', version: '2.3.0', author: 'Wes Bos', rating: 4.9, downloads: 125000, category: 'Themes', description: 'Official Cobalt2 theme for Monaco editor with vibrant blue backgrounds.', tags: ['cobalt2', 'wesbos'], isInstalled: false, isEnabled: false },
  { id: 'plug_horizon_theme', name: 'Horizon Dual Theme', version: '1.0.8', author: 'jolaleye', rating: 4.8, downloads: 67000, category: 'Themes', description: 'A warm dual theme featuring soft red, orange, and gold accents.', tags: ['horizon', 'warm'], isInstalled: false, isEnabled: false },
  { id: 'plug_winter_is_coming', name: 'Winter is Coming (John Papa)', version: '1.4.0', author: 'John Papa', rating: 4.8, downloads: 92000, category: 'Themes', description: 'Dark blue theme created by John Papa for high readability during long sessions.', tags: ['winter', 'johnpapa'], isInstalled: false, isEnabled: false },
  { id: 'plug_ayu_theme', name: 'Ayu Mirage & Dark Theme', version: '1.0.5', author: 'ayu', rating: 4.8, downloads: 84000, category: 'Themes', description: 'A simple theme with bright colors and 3 versions (Light, Mirage, Dark).', tags: ['ayu', 'mirage'], isInstalled: false, isEnabled: false },
  { id: 'plug_panda_theme', name: 'Panda Syntax Theme', version: '1.3.0', author: 'Siamak', rating: 4.7, downloads: 58000, category: 'Themes', description: 'Super sleek dark syntax theme designed for React and TypeScript.', tags: ['panda', 'syntax'], isInstalled: false, isEnabled: false },
  { id: 'plug_slime_theme', name: 'Slime Acid Theme', version: '0.8.0', author: 'Slime', rating: 4.6, downloads: 35000, category: 'Themes', description: 'Acid green and deep purple high-contrast theme for matrix aesthetic.', tags: ['slime', 'acid'], isInstalled: false, isEnabled: false },

  // ==================== 6. DEVOPS & CLOUD (20 Plugins) ====================
  { id: 'plug_docker', name: 'Docker Container Manager', version: '1.24.0', author: 'Docker Inc', rating: 4.9, downloads: 260000, category: 'DevOps & Cloud', description: 'Build Dockerfiles, manage multi-container Docker Compose stacks, and view logs.', tags: ['docker', 'containers', 'devops'], isInstalled: true, isEnabled: true },
  { id: 'plug_kubernetes', name: 'Kubernetes Cluster Engine', version: '1.3.0', author: 'CNCF', rating: 4.8, downloads: 95000, category: 'DevOps & Cloud', description: 'Deploy Helm charts, inspect Pods, services, and ingress rules.', tags: ['k8s', 'kubernetes', 'cloud'], isInstalled: false, isEnabled: false },
  { id: 'plug_vercel', name: 'Vercel 1-Click Deployment', version: '4.1.0', author: 'Vercel', rating: 4.9, downloads: 290000, category: 'DevOps & Cloud', description: 'Automatic production deployments, preview URLs, and serverless edge logs.', tags: ['vercel', 'deploy', 'nextjs'], isInstalled: true, isEnabled: true },
  { id: 'plug_aws', name: 'AWS S3 & CloudFront Storage', version: '3.1.0', author: 'Amazon Web Services', rating: 4.8, downloads: 175000, category: 'DevOps & Cloud', description: 'Upload static assets directly to AWS S3 buckets with CloudFront CDN distribution.', tags: ['aws', 's3', 'cdn'], isInstalled: false, isEnabled: false },
  { id: 'plug_github_actions', name: 'GitHub Actions CI/CD Pipeline', version: '2.0.1', author: 'GitHub', rating: 4.9, downloads: 210000, category: 'DevOps & Cloud', description: 'Visual pipeline builder for GitHub Actions workflows, automated testing, and release binaries.', tags: ['cicd', 'github', 'pipeline'], isInstalled: true, isEnabled: true },
  { id: 'plug_netlify', name: 'Netlify Edge Functions & Host', version: '3.0.0', author: 'Netlify', rating: 4.8, downloads: 145000, category: 'DevOps & Cloud', description: 'Deploy JAMstack visual builds to global Netlify CDN with edge functions.', tags: ['netlify', 'jamstack', 'edge'], isInstalled: false, isEnabled: false },
  { id: 'plug_cloudflare_pages', name: 'Cloudflare Workers & Pages', version: '2.8.0', author: 'Cloudflare', rating: 4.9, downloads: 160000, category: 'DevOps & Cloud', description: 'Deploy fullstack apps to Cloudflare ultra-low latency edge network in 300+ cities.', tags: ['cloudflare', 'workers', 'edge'], isInstalled: true, isEnabled: true },
  { id: 'plug_terraform', name: 'HashiCorp Terraform IaC', version: '2.30.0', author: 'HashiCorp', rating: 4.8, downloads: 125000, category: 'DevOps & Cloud', description: 'Infrastructure as Code syntax highlighting, plan validation, and cloud provisioning.', tags: ['terraform', 'iac', 'hashicorp'], isInstalled: false, isEnabled: false },
  { id: 'plug_ansible', name: 'Ansible Automation Playbooks', version: '24.1.0', author: 'Red Hat', rating: 4.7, downloads: 78000, category: 'DevOps & Cloud', description: 'YAML playbook syntax checking, module autocompletion, and server deployment.', tags: ['ansible', 'yaml', 'redhat'], isInstalled: false, isEnabled: false },
  { id: 'plug_digitalocean', name: 'DigitalOcean Droplets & Apps', version: '1.9.0', author: 'DigitalOcean', rating: 4.8, downloads: 88000, category: 'DevOps & Cloud', description: '1-click Droplet deployment, App Platform hosting, and managed Postgres DBs.', tags: ['digitalocean', 'droplet', 'cloud'], isInstalled: false, isEnabled: false },
  { id: 'plug_google_cloud', name: 'Google Cloud Platform (GCP)', version: '2.5.0', author: 'Google Cloud', rating: 4.8, downloads: 135000, category: 'DevOps & Cloud', description: 'Manage Cloud Run services, BigQuery datasets, and Google Kubernetes Engine (GKE).', tags: ['gcp', 'google', 'cloud'], isInstalled: false, isEnabled: false },
  { id: 'plug_azure', name: 'Microsoft Azure Web Apps', version: '1.12.0', author: 'Microsoft', rating: 4.7, downloads: 140000, category: 'DevOps & Cloud', description: 'Deploy containerized web apps to Azure App Service and Azure Functions.', tags: ['azure', 'microsoft', 'cloud'], isInstalled: false, isEnabled: false },
  { id: 'plug_render', name: 'Render Cloud Deployer', version: '1.2.0', author: 'Render', rating: 4.8, downloads: 92000, category: 'DevOps & Cloud', description: 'Zero-config cloud hosting for static sites, Node.js web services, and background workers.', tags: ['render', 'hosting'], isInstalled: false, isEnabled: false },
  { id: 'plug_fly_io', name: 'Fly.io Global Application Host', version: '0.2.0', author: 'Fly.io', rating: 4.9, downloads: 81000, category: 'DevOps & Cloud', description: 'Deploy fullstack app servers close to your users on bare-metal cloud servers worldwide.', tags: ['flyio', 'edge', 'docker'], isInstalled: false, isEnabled: false },
  { id: 'plug_nginx', name: 'Nginx Reverse Proxy Config', version: '0.4.1', author: 'Nginx Org', rating: 4.7, downloads: 105000, category: 'DevOps & Cloud', description: 'Nginx configuration syntax validation, SSL certificate binding, and rate limit rules.', tags: ['nginx', 'proxy', 'ssl'], isInstalled: false, isEnabled: false },
  { id: 'plug_datadog', name: 'Datadog APM & Metrics', version: '3.1.0', author: 'Datadog', rating: 4.8, downloads: 74000, category: 'DevOps & Cloud', description: 'Application performance monitoring, log tailing, and cloud infrastructure dashboards.', tags: ['datadog', 'apm', 'logs'], isInstalled: false, isEnabled: false },
  { id: 'plug_prometheus', name: 'Prometheus & Grafana Metrics', version: '2.4.0', author: 'Prometheus', rating: 4.8, downloads: 86000, category: 'DevOps & Cloud', description: 'PromQL query validation, metric scrape endpoints, and Grafana dashboard charts.', tags: ['prometheus', 'grafana', 'metrics'], isInstalled: false, isEnabled: false },
  { id: 'plug_cloudflare_dns', name: 'Cloudflare DNS & WAF', version: '1.4.0', author: 'Cloudflare', rating: 4.9, downloads: 112000, category: 'DevOps & Cloud', description: 'Manage custom domain DNS records, DDoS protection rules, and SSL/TLS encryption.', tags: ['cloudflare', 'dns', 'waf'], isInstalled: false, isEnabled: false },
  { id: 'plug_pm2', name: 'PM2 Process Manager', version: '5.3.0', author: 'Keymetrics', rating: 4.8, downloads: 120000, category: 'DevOps & Cloud', description: 'Production process manager for Node.js with built-in load balancer and reload.', tags: ['pm2', 'nodejs', 'process'], isInstalled: true, isEnabled: true },
  { id: 'plug_tailscale', name: 'Tailscale Secure Mesh VPN', version: '1.60.0', author: 'Tailscale', rating: 4.9, downloads: 68000, category: 'DevOps & Cloud', description: 'Zero-config mesh VPN to connect VisualStack local dev server securely to remote teams.', tags: ['tailscale', 'vpn', 'secure'], isInstalled: false, isEnabled: false },
];

export class PluginMarketplace {
  private plugins: MarketplacePlugin[] = [];
  private listeners: Set<() => void> = new Set();
  private activeSDKs: Map<string, VisualStackPluginSDK> = new Map();

  constructor() {
    this.loadState();
    this.initInstalledPluginsSDK();
  }

  private loadState(): void {
    try {
      const saved = localStorage.getItem('visualstack_plugins_installed_v2');
      if (saved) {
        const parsedMap: Record<string, boolean> = JSON.parse(saved);
        this.plugins = REAL_PLUGINS_DATA.map((p) => ({
          ...p,
          isInstalled: parsedMap[p.id] !== undefined ? parsedMap[p.id] : p.isInstalled,
          isEnabled: parsedMap[p.id] !== undefined ? parsedMap[p.id] : p.isEnabled,
        }));
        return;
      }
    } catch {
      // Fallback
    }
    this.plugins = [...REAL_PLUGINS_DATA];
  }

  private saveState(): void {
    try {
      const map: Record<string, boolean> = {};
      this.plugins.forEach((p) => {
        map[p.id] = p.isInstalled;
      });
      localStorage.setItem('visualstack_plugins_installed_v2', JSON.stringify(map));
      this.notifyListeners();
    } catch {
      // Ignore
    }
  }

  private initInstalledPluginsSDK() {
    this.plugins.filter((p) => p.isInstalled && p.isEnabled).forEach((p) => {
      this.registerPluginSDK(p);
    });
  }

  private registerPluginSDK(plugin: MarketplacePlugin) {
    const sdk = new VisualStackPluginSDK({
      id: plugin.id,
      name: plugin.name,
      version: plugin.version,
      author: plugin.author,
      description: plugin.description,
      category: plugin.category,
    });

    if (plugin.category === 'UI Kits & Figma') {
      sdk.registerComponent(`${plugin.name} Widget`, plugin.category);
    }

    this.activeSDKs.set(plugin.id, sdk);
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }

  public getPlugins(category?: string, filterType?: 'all' | 'installed' | 'featured' | 'popular'): MarketplacePlugin[] {
    let result = [...this.plugins];

    if (category && category !== 'All') {
      result = result.filter((p) => p.category === category);
    }

    if (filterType === 'installed') {
      result = result.filter((p) => p.isInstalled);
    } else if (filterType === 'popular') {
      result = result.sort((a, b) => b.downloads - a.downloads);
    } else if (filterType === 'featured') {
      result = result.filter((p) => p.rating >= 4.9);
    }

    return result;
  }

  public toggleInstall(pluginId: string): boolean {
    const target = this.plugins.find((p) => p.id === pluginId);
    if (!target) return false;
    target.isInstalled = !target.isInstalled;
    target.isEnabled = target.isInstalled;

    if (target.isInstalled) {
      this.registerPluginSDK(target);
    } else {
      this.activeSDKs.delete(target.id);
    }

    this.saveState();
    return true;
  }

  public getInstalledCount(): number {
    return this.plugins.filter((p) => p.isInstalled).length;
  }

  public getTotalCount(): number {
    return this.plugins.length;
  }
}

export const pluginMarketplace = new PluginMarketplace();
