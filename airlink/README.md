# LinkNest · 邻里书架

邻里图书共享手机网页版。当前阶段优先开发 Safari / Chrome 直接访问的手机网页体验，原生 App 和安装体验放到后续阶段。

## 文件结构

```
airlink-app/
├── index.html          # 主应用（含完整 React 代码）
├── vercel.json         # Vercel 部署配置
├── netlify.toml        # Netlify 部署配置
├── README.md
├── manifest.json       # Web 清单
├── sw.js               # Service Worker（网页缓存/离线兜底）
├── favicon.png
├── icon-192.png        # 历史图标
├── icon-512.png        # 历史图标（大）
├── linknest-favicon.png
├── linknest-icon-192.png
├── linknest-icon-512.png
├── linknest-white-favicon.png
├── linknest-white-icon-192.png
├── linknest-white-icon-512.png
└── vendor/
    ├── react.production.min.js
    └── react-dom.production.min.js
```

---

## 部署方式

### 方式一：Vercel（推荐，最快）

1. 注册 [vercel.com](https://vercel.com)（免费）
2. 安装 Vercel CLI（可选）或直接用网页操作
3. 将本文件夹上传到 GitHub 仓库
4. 在 Vercel 控制台 → New Project → 导入仓库
5. **Root Directory** 设为 `airlink-app`（或直接是根目录）
6. Framework Preset 选 **Other**
7. 点击 Deploy — 约 30 秒上线 ✓

部署后获得：`https://linknest-xxx.vercel.app`

---

### 方式二：Netlify

1. 注册 [netlify.com](https://netlify.com)（免费）
2. 拖拽 `airlink-app` 文件夹到 [app.netlify.com/drop](https://app.netlify.com/drop)
3. 自动部署完成 ✓（最简单，无需 GitHub）

或通过 GitHub 连接持续部署。

---

### 方式三：GitHub Pages

1. 创建 GitHub 仓库
2. 把 `airlink-app` 文件夹内容推送到 `main` 分支
3. Settings → Pages → Source 选 `main` 分支根目录
4. 等待约 1 分钟 → 获得 `https://username.github.io/linknest`

注意：GitHub Pages 需要在 `index.html` 中把 `sw.js` 注册路径改为相对路径。

---

## 手机网页版使用

### iPhone / iPad
1. 用 Safari 打开网站链接
2. 直接在浏览器中使用 LinkNest
3. 允许定位、相机、通知等权限后可测试对应功能

### Android
1. 用 Chrome 打开网站链接
2. 直接在浏览器中使用 LinkNest
3. 允许定位、相机、通知等权限后可测试对应功能

原生 iOS / Android App、添加到主屏幕图标和应用商店发布后续再开发。

---

## 技术说明

- **框架**：React 18（优先加载本地 `vendor/`，CDN 作为备用源）
- **JSX 转译**：Babel Standalone（浏览器内实时转译）
- **手机网页版**：面向 Safari / Chrome 的移动端浏览器体验
- **网页缓存**：Service Worker + Web Manifest 仅用于网页缓存、基础离线兜底和浏览器元信息
- **构建工具**：仍可直接部署静态文件，也可用 Vite 构建 `dist/`
- **云端后端**：Supabase Auth + Postgres（通过 `supabase-js@2` CDN，可在「我」页填写项目配置）

---

## 本版修复

- 修复 Vercel 部署时 `sw.js` / `manifest.json` 被错误重写为 `index.html` 的问题。
- `manifest.json` 使用相对 `start_url` 和 `scope`，支持子目录部署。
- Service Worker 会预缓存核心本地文件，提升离线可打开概率。
- React 运行库优先走本地 `vendor/`，CDN 作为备用源；运行库加载失败时会显示明确提示。
- 「我」页面新增应用诊断，可检查更新、重新加载、查看错误日志数量并清除错误日志。
- 产品方向调整为手机网页版优先，manifest 改为浏览器显示模式；原生 App 后续再开发。

## 本版新增

- 「我」页面新增数据备份卡片，可导出全部本地 LinkNest 数据为 JSON 文件。
- 支持从 LinkNest 备份 JSON 导入并覆盖恢复书架、借阅、消息、积分、徽章、搜索半径等本地数据。
- 构建号与 Service Worker 缓存版本会随每版更新，便于部署后触发新版缓存。

## 扫码识别增强

- 添加浏览器原生 `BarcodeDetector` 优先识别，支持 ISBN 条形码和包含 ISBN 的二维码。
- 保留纯 JS EAN-13 解码作为兜底，并增加多行采样，提升反光、轻微倾斜、较远画面下的识别成功率。
- 扫描页提示和入口文案更新为「扫码识别」，无法识别时仍可手动输入 ISBN。

## 书籍信息增强

- 扩展书籍分类：小说、文学、历史、科技、儿童、心理、商业、艺术、教育、健康、其他。
- 扫码查询 Open Library 后，会结合书名、作者和 subjects 自动识别书籍分类。
- 添加书籍时新增「新旧程度」选项：全新、九成新、轻微使用、有笔记、折痕/磨损。
- 去掉备选封面图标，封面优先显示书库图片或拍摄照片；缺图时显示统一占位。
- 书籍详情页新增「书籍评测」，可查看平均分、已有评测，并本地新增自己的星级和文字评测。
- 出借者确认收到归还书籍时，会弹出借书者评价提醒；评价会保存在「我」页的借书者评价卡片中。
- 借书/添加书籍时会引导到「我」页登录或注册；已支持 Supabase 邮箱密码 Auth。
- 已取消互换相关入口和流程，借阅申请消息中只保留“同意借阅”操作。
- 消息页改为会话列表：每个联系人只显示最新一条消息，未读联系人头像显示蓝点，点击后进入完整历史交流。
- 消息详情页支持点击借书者头像查看对方资料，并可继续打开 TA 的书架；测试借书者也提供示例书架，方便验证借阅流程。
- 「我」页新增「云端账号」卡片：普通用户只需邮箱和密码即可注册、登录、上传本地数据到云端、从云端恢复。
- 新增 Web Push 订阅：填写 VAPID public key 后可在浏览器生成推送订阅，并保存到 Supabase。
- 新增 Supabase Edge Function `send-push`，可使用 VAPID private key 实际发送 Web Push；「我」页支持发送测试推送。
- Service Worker 新增 `push` 与 `notificationclick` 处理，可展示服务端发送的通知。
- 「我」页新增地图服务配置，支持 Google Maps JavaScript API 或高德 Web JS API；未配置时保留模拟地图。
- 新增 Vite 配置：`npm run dev` 本地开发，`npm run build` 输出 `dist/`，构建时自动复制 PWA 静态资源和 Supabase 函数目录。
- 重新优化「我」页面：顶部个人概览、账号同步、网页工具、信用徽章、备份和诊断按移动端使用场景重新分组。
- Supabase URL / public key 改为内部云端配置，不再要求普通用户填写数据库链接；未配置时会提示继续使用本地模式。
- 云端未配置时支持本地测试账号，注册后仍可添加书籍、借书和继续开发测试。
- 新增「好友」tab；借书者资料页可添加好友，添加书籍时可选择「所有人开放」或「仅对朋友」开放。
- 构建号与 Service Worker 缓存版本已更新为 `202605132024`。
- 应用品牌名已更新为 LinkNest，并替换为 LinkNest PNG 图标。

---

## Supabase 配置

在 Supabase SQL Editor 中执行以下 SQL，然后把 Project URL 和 publishable/anon public key 配置到 `LINKNEST_CLOUD_CONFIG`。普通用户不会在 LinkNest 页面里看到这些数据库配置。

```sql
create table if not exists public.airlink_user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.airlink_push_subscriptions (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  subscription jsonb not null,
  user_agent text,
  updated_at timestamptz not null default now()
);

alter table public.airlink_user_data enable row level security;
alter table public.airlink_push_subscriptions enable row level security;

create policy "Users manage own LinkNest data"
on public.airlink_user_data
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage own push subscriptions"
on public.airlink_push_subscriptions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

Web Push 需要 HTTPS（或 localhost/127.0.0.1 开发环境）。真正发送通知需要服务端或 Supabase Edge Function 使用 VAPID private key 调用推送服务；前端只保存订阅，不暴露 private key。

### Edge Function 推送

本包已包含 `supabase/functions/send-push/index.ts`。部署前先设置 VAPID secrets：

```bash
supabase secrets set VAPID_SUBJECT=mailto:admin@example.com
supabase secrets set VAPID_PUBLIC_KEY=你的_PUBLIC_KEY
supabase secrets set VAPID_PRIVATE_KEY=你的_PRIVATE_KEY
supabase functions deploy send-push
```

部署后在 LinkNest「我」页：

1. 确认 `LINKNEST_CLOUD_CONFIG` 已配置，并用邮箱密码登录
2. 填 VAPID public key
3. 点「开启推送」保存订阅
4. 点「发送测试推送」调用 Edge Function 验证通知

### 真实地图 API

「我」页的「地图服务」可选择：

- `Google`：填写 Google Maps JavaScript API key
- `高德`：填写高德地图 Web JS API key
- `模拟`：不使用第三方地图，保留本地预览

配置后打开首页位置按钮，搜索范围面板会优先加载真实地图并显示书籍标记。

## Vite 构建

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` 会输出 `dist/`，并复制 `manifest.json`、`sw.js`、图标、`vendor/` 和 `supabase/`。没有安装依赖时，原始静态文件仍可直接部署。

---

## 下一步（功能扩展）

- [x] 接入 Supabase 做真实数据存储
- [x] 添加用户注册/登录（Auth）
- [x] 集成 Web Push 订阅与 Service Worker 通知接收
- [x] 添加 Supabase Edge Function 实际发送 Web Push
- [x] 接入真实地图 API（高德/Google Maps）
- [x] 用 Vite 打包优化加载速度
- [ ] 后续开发原生 App / 添加到主屏幕体验 / App Store 与 Google Play 发布
