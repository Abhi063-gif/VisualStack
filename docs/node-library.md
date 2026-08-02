# VisualStack Studio — Complete Production Node Catalog (200+ Nodes Across 25 Categories)

VisualStack Studio features a production-grade visual automation engine with over **200+ production node definitions** across **25 specialized categories**.

---

## 📌 Complete Category & Node Index

### 1. Navigation & Routing (35 Nodes)
- **Screen & Drawer Routing**: `Navigate` (`nav_go_to`), `Open Screen`, `Replace Screen`, `Pop Screen`, `Drawer`, `Bottom Navigation`, `Tab Navigation`, `Route`, `Dynamic Route`, `Protected Route`, `Redirect`, `Deep Link`, `Browser Back`, `Browser Forward`, `Refresh`, `Scroll To`, `Anchor`.
- **Modals & Overlays**: `Modal` (`nav_open_modal`), `Close Modal`, `Bottom Sheet`, `Popup`, `Toast`, `Snackbar`, `Tooltip`, `Context Menu`, `Breadcrumb`, `Stepper`, `Wizard`, `Multi Page Form`.
- **Navigation Utilities**: `Navigation Guard`, `Route Parameters`, `Query Parameters`, `URL Builder`, `History Push`, `History Replace`, `History Clear`.

---

### 2. Variables & State (45 Nodes)
- **Scope & Declaration**: `Variable` (`var_get`/`var_set`), `Local Variable`, `Global Variable`, `Constant`, `State`, `Context`, `Store`, `Session`, `Cache`, `Cookie`, `Environment Variable`, `Secret`.
- **Data Types & Constants**: `JSON`, `Object`, `Array`, `String`, `Number`, `Boolean`, `Null`, `Date`, `Time`, `UUID`, `Random`, `Counter`.
- **Mutations & Operations**: `Increment`, `Decrement`, `Reset`, `Assign`, `Merge`, `Clone`, `Push`, `Pop`, `Filter`, `Sort`, `Find`, `Map`, `Reduce`, `Group`, `Flatten`.
- **Reactivity & Expressions**: `Watch Variable`, `Trigger Variable`, `Bind State`, `Computed Property`, `Expression`, `Formula`.

---

### 3. Logic & Control Flow (65 Nodes)
- **Branching & Switch**: `If` (`cond_if`), `Else`, `Else If`, `Switch`, `Match`, `Equal`, `Not Equal`, `Greater`, `Less`, `Greater Equal`, `Less Equal`, `AND`, `OR`, `XOR`, `NOT`.
- **Loops & Delay**: `Loop`, `For`, `While`, `Do While`, `For Each` (`loop_for_each`), `Break`, `Continue`, `Delay` (`delay_wait`), `Wait`, `Debounce`, `Throttle`, `Timer`, `Interval`, `Scheduler`, `Retry`.
- **Error Handling & Assertions**: `Error Handler`, `Try` (`wf_try_catch`), `Catch`, `Finally`, `Throw Error` (`wf_throw_error`), `Assert`, `Validate`, `Required`, `Regex`, `Exists`, `Empty`, `Null Check`, `Is Number`, `Is String`, `Is Array`, `Is Object`, `Is Date`.
- **Data Transformation**: `Parse JSON`, `String Builder`, `Formatter`, `Converter`, `Round`, `Floor`, `Ceil`, `Absolute`, `Min`, `Max`, `Clamp`, `Random Number`, `UUID Generator`, `Hash`, `Encrypt`, `Decrypt`, `Encode`, `Decode`.

---

### 4. Backend & API (70 Nodes)
- **HTTP Methods & Protocols**: `HTTP Request` (`api_fetch` - GET, POST, PUT, PATCH, DELETE), `GraphQL Query`, `GraphQL Mutation`, `REST API`, `SOAP`, `Webhook`, `API Gateway`, `API Response`, `Middleware`.
- **Authentication & Security**: `JWT Verify` (`sec_jwt_verify`), `JWT Create` (`sec_jwt_generate`), `OAuth` (`auth_social`), `Login` (`auth_login`), `Logout` (`auth_logout`), `Signup` (`auth_signup`), `Refresh Token`, `Session`, `Cookie`, `Headers`, `Query Params`, `Path Params`, `Form Data`, `Multipart Upload`, `Download File`, `Upload File`, `Compression`, `Encryption`, `Validation`, `Authentication`, `Authorization`, `Role Check` (`auth_check_role`), `Permission Check`, `Rate Limiter`, `Cache Response`, `Proxy`, `Reverse Proxy`, `CORS`, `Logger`, `Metrics`, `Health Check`.
- **Messaging Queues & Realtime**: `Queue`, `Worker`, `Event`, `Publish`, `Subscribe`, `Kafka`, `RabbitMQ`, `Redis PubSub`, `Socket.io`, `SSE`, `Cron`, `Background Task`.
- **Integrations**: `Email` (`comm_send_email`), `SMS` (`comm_send_sms`), `Push Notification` (`comm_push_notif`), `WhatsApp`, `Telegram`, `Discord`, `Slack`, `Stripe`, `Razorpay`, `PayPal`, `OpenAI`, `Gemini`.

---

### 5. Database (60 Nodes)
- **CRUD Operations**: `Create Record` (`db_insert_one`), `Read Record` (`db_find_by_id`), `Update Record` (`db_update_one`), `Delete Record` (`db_delete_one`), `Upsert`, `Bulk Insert`, `Bulk Update`, `Bulk Delete`.
- **Transactions & Queries**: `Transaction`, `Rollback`, `Commit`, `Join`, `Aggregate`, `Count`, `Average`, `Sum`, `Min`, `Max`, `Distinct`, `Filter`, `Search`, `Sort`, `Group By`, `Pagination`, `Cursor`, `Index`, `Migration`, `Seed`, `SQL Query`, `Mongo Query`.
- **Databases Supported**: `Firebase`, `Firestore`, `Realtime Database`, `Supabase`, `PostgreSQL`, `MySQL`, `SQLite`, `MongoDB`, `Redis`, `Elasticsearch`, `Neo4j`, `Cassandra`, `Realm`, `Prisma`, `Drizzle`, `Sequelize`, `Mongoose`.
- **Management & Backup**: `Backup`, `Restore`, `Export`, `Import`, `Sync`, `Trigger`, `Stored Procedure`, `Function`, `Schema`, `Collection`, `Table`, `View`, `Relationship`.

---

### 6. Cloud Services (45 Nodes)
- **BaaS & Cloud Providers**: `Firebase Auth` (`cloud_firebase_auth`), `Firebase Storage`, `Firebase Messaging`, `Firebase Analytics`, `Supabase Auth`, `Supabase Storage` (`cloud_supabase_storage`), `AWS S3` (`cloud_aws_s3_upload`), `AWS Lambda` (`cloud_aws_lambda`), `AWS SES`, `AWS SNS`, `Azure Blob`, `Azure Function`, `Google Cloud Storage`, `Cloudinary`, `DigitalOcean Spaces`.
- **Deployment & Hosting**: `Vercel Deploy`, `Netlify Deploy`, `Railway Deploy`, `Render Deploy`, `Docker` (`cloud_docker_deploy`), `Docker Compose`, `Kubernetes`.
- **DevOps & Infrastructure**: `GitHub`, `GitLab`, `Bitbucket`, `FTP`, `SFTP`, `CDN`, `Edge Function`, `Serverless`, `Secret Manager`, `Environment Manager`, `Domain Manager`, `SSL`, `DNS`, `Backup`, `Restore`, `Logs`, `Monitoring`, `Analytics`, `Crashlytics`, `Feature Flags`, `Remote Config`, `OTA Update`, `App Distribution`.

---

### 7. AI & Machine Learning Nodes (40 Nodes)
- **LLM Models & APIs**: `OpenAI Chat` (`ai_openai_chat`), `Gemini Chat`, `Claude`, `DeepSeek`, `Mistral`, `Ollama`.
- **AI Pipelines**: `Prompt`, `Agent`, `Memory`, `Vector Search`, `Embedding`, `RAG`, `OCR`, `Speech To Text`, `Text To Speech`, `Image Generation`, `Image Analysis`, `Face Detection`, `Object Detection`, `Background Remove`, `Translation`, `Summarization`, `Classification`, `Moderation`, `Sentiment` (`ai_sentiment`).
- **Code & Generator Agents**: `Named Entity`, `Keyword Extraction`, `SQL Generator`, `Code Generator`, `UI Generator`, `Backend Generator`, `Documentation`, `Test Generator`, `Refactor`, `Explain Code`, `AI Workflow`, `AI Chain`, `AI Router`, `AI Tool Call`, `AI Function`.

---

### 8. Development Tools (45 Nodes)
- **Version Control & Terminal**: `Terminal` (`dev_terminal_cmd`), `Git Clone`, `Git Commit` (`dev_git_commit_push`), `Git Push`, `Git Pull`, `Branch`, `Merge`.
- **Build & Debug Engine**: `Build`, `Run`, `Debug`, `Breakpoint` (`wf_breakpoint`), `Logger`, `Console`, `Preview`, `Emulator`, `Browser`, `Device Preview`, `Responsive Preview`, `Hot Reload` (`dev_hot_reload`), `Build APK`, `Build EXE`, `Build IPA`, `Build Docker`, `Generate Code`, `Generate Docs`, `Generate API`, `Generate Tests`, `Export Project`, `Import Project`, `ZIP`, `Publish`, `Install Package`, `Remove Package`, `Update Package`.
- **Profiling & Inspection**: `Environment`, `Dependency Graph`, `Bundle Analyzer`, `Profiler`, `Memory Inspector`, `Network Inspector`, `Accessibility Checker`, `SEO Checker`, `Lighthouse`, `Performance Monitor`, `Error Monitor`.

---

### 9. Utilities & Convertors (50 Nodes)
- **Storage & System**: `Clipboard` (`dev_clipboard`), `Local Storage`, `Session Storage`, `IndexedDB`, `File System`, `Download`, `Upload`, `QR Scanner` (`dev_qr_scanner`), `Barcode Scanner`, `Camera` (`dev_camera`), `GPS` (`dev_gps_location`), `Geolocation`, `Accelerometer`, `Gyroscope`, `Bluetooth`, `NFC`, `Vibration`, `Clipboard Copy`, `Clipboard Paste`, `Notification`, `Share`, `Print`.
- **Files & Data Converts**: `PDF` (`util_pdf_generator`), `Excel` (`util_excel_csv_export`), `CSV`, `XML`, `YAML`, `Base64` (`util_base64_encode`), `JWT`, `UUID` (`sec_uuid`), `MD5`, `SHA256`, `AES`, `RSA`, `Cron`, `Regex`, `Timezone`, `Currency`, `Unit Converter`, `Color Converter`, `Lorem Ipsum`, `Faker Data` (`util_faker_data`), `UUID Generator`, `Password Generator`, `Slug Generator`, `URL Builder`, `Date Formatter`, `Number Formatter`, `Math Expression`, `Calculator`.

---
*VisualStack Studio Production Library Guide — Version 3.0 Enterprise Edition*
