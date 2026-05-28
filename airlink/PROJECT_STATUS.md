# LinkNest 项目说明与交接记录

更新时间：2026-05-25

这个文件用于在开启新对话时快速恢复项目上下文。新对话可以直接把本文件内容发给 Codex，并说明“请基于这个项目继续开发”。

## 项目位置

- 本地项目目录：`/Users/john/Documents/LinkNest -old/LinkNest-old/airlink`
- GitHub 仓库：`git@github.com:cao6583-wq/airline-codex.git`
- GitHub Pages：`https://cao6583-wq.github.io/airline-codex/`
- 最近提交：`5c27388 Restyle app with mint book UI`

## 当前定位

LinkNest 是一个邻里/朋友之间共享书籍的手机网页版 PWA。当前阶段优先开发手机浏览器体验，原生 iOS / Android App 后续再做。

产品核心方向：

- 附近邻居之间共享好书
- 好友之间可以看到更多书架内容
- 书籍可以公开、仅好友可见、仅自己可见
- 借阅流程强调信任、协商、归还和评价
- 视觉方向是温暖、干净、社区感强的阅读应用，不做成普通二手市场或库存管理工具

## 技术结构

- 主应用：`index.html`
- Service Worker：`sw.js`
- Web Manifest：`manifest.json`
- Vite 配置：`vite.config.js`
- Supabase Edge Function：`supabase/functions/send-push/index.ts`
- 本地 React runtime：`vendor/react.production.min.js`、`vendor/react-dom.production.min.js`
- 构建命令：`npm run build`
- 开发命令：`npm run dev`

当前代码主要是一个静态 React-in-HTML PWA，数据大部分仍使用本地 localStorage / demo 数据。Supabase、Auth、Web Push、地图 API 已经预留配置和部分入口，但还没有完全替换成本地数据之外的真实云端数据流。

## 已完成功能

### 基础 PWA

- 修复 GitHub Pages / Vercel / Netlify 静态部署兼容。
- `manifest.json` 使用相对 `start_url` 和 `scope`，支持子目录部署。
- Service Worker 预缓存核心文件。
- React 优先加载本地 `vendor/` 文件，CDN 作为备用。
- React 加载失败时显示明确错误提示。
- 应用品牌已改为 `LinkNest`。
- 已替换 LinkNest 图标资源。
- 构建号与 Service Worker 缓存版本：`202605272303`。
- Manifest、favicon、iOS `apple-touch-icon` 已加版本参数，便于手机 Safari/PWA 获取新图标。
- “我的 > 应用诊断”新增“清理缓存”，会清除 Cache Storage 和注销旧 Service Worker 后带新构建号重载，不会清空本地书架/消息数据。

### 首页 / 附近

- 首页改为“附近”。
- 显示附近有多少本书。
- 支持搜索书名、作者或邻里。
- 支持分类筛选，包括小说、文学、儿童、心理、商业等。
- 根据访客/登录用户过滤书籍：
  - 游客只能看到公开书籍。
  - 登录用户可以看到好友开放的书籍。
  - “仅自己”书籍不会展示给别人。
- 打开自己的书时不显示“向我申请借阅”。
- 首页点击出借人头像/名字可以打开对方资料页。
- 首页支持列表 / 地图视图切换，默认进入地图。
- 地图视图包含书籍 marker、当前位置、范围入口、底部选中书籍卡片、详情和申请借阅入口。

### 添加书籍

- 支持扫码识别 ISBN / 二维码 / 条形码。
- 原生 `BarcodeDetector` 优先，JS 解码作为兜底。
- 可从 Open Library 查询书籍信息。
- 可自动识别图书分类。
- 可编辑书名、作者、分类、品相、租期、简介。
- 可添加/显示照片。
- 添加时支持设置可见范围：
  - 所有人开放
  - 仅对朋友开放
  - 仅自己可见

### 书籍详情

- 可查看书籍信息、品相、简介、租期。
- 可编辑租期、品相、简介等字段。
- 暂停共享和删除入口已移动到图书页面。
- 支持书籍评测。
- 同一本书如果由不同人持有，评价可以共同显示。

### 我的书架

- 当前设计已多次迭代。
- 最新 UI 已参考薄荷绿/墨绿色手机书籍列表稿调整。
- 出借者资料/评价、对方书架选择、借阅卡片、见面地点、延期和奖励反馈已统一收敛为墨绿/薄荷绿视觉，移除旧紫色主按钮和状态色。
- 底部导航为：
  - 附近
  - 书架
  - 消息
  - 社区
  - 我的
- 书架页包含：
  - 共享
  - 借阅
  - 收藏
- 收藏里的书默认仅自己可见。
- 收藏书籍可以改为可分享，并选择公开或仅好友。
- “我的所有书籍”概念已覆盖共享、借出中、协商中、仅自己所见等状态。
- 借阅页面显示借自谁、剩余多少天归还。
- 申请归还时可以提出归还日期，等待对方同意后才更新归还日期和剩余天数。

### 借阅流程

- 用户可申请借书。
- 出借者可同意借阅。
- 只有同意借书后才启动“协调见面”。
- 可申请归还。
- 出借者确认收到归还后，会提醒出借者评价借书者。
- 借书者/出借者评价会被记录。
- 好友最多可以借 10 本书。

### 消息

- 消息页面按联系人聚合。
- 每个人只显示一行最新消息。
- 未读联系人头像显示蓝点。
- 点击联系人后进入完整历史交流。
- 点击借书者头像可查看对方资料和书架。
- 好友申请会作为消息提醒出现。
- 好友申请可确认、不同意或不操作。
- 已取消“提议互换”功能。

### 好友

- 有独立好友 tab / 社区相关入口。
- 可从用户资料页添加好友。
- 点击“添加好友”会提示：
  - 好友可以看到你所有书柜里对好友开放的书。
  - 需要确认后才发送申请。
- 对方可在消息页处理好友申请。

### 社区 / 俱乐部

- 社区页已切为“朋友 / 俱乐部”两个 Tab。
- 俱乐部支持默认列表、搜索、加入俱乐部、创建俱乐部和本地持久化。
- 已新增俱乐部详情页：
  - 动态 Tab：展示俱乐部新增书籍、线下交换、成员邀请等事件。
  - 动态 Tab 已支持已加入成员发布“动态 / 新书 / 活动”三类内容，发布后写入本地 `clubs.activities`。
  - 书架 Tab：按俱乐部成员聚合书籍，支持按分类筛选、只看可借，点击书籍可打开书籍详情页。
  - 成员 Tab：展示成员列表、成员信用/借出信息、消息入口。
  - 已加入成员可编辑俱乐部名称、位置/主题、简介和封面色，编辑后写入本地 `clubs` 数据并追加动态。
  - 成员邀请已升级为真实好友选择列表优先，可一键邀请好友；非好友仍可通过姓名或手机号兜底邀请，邀请会写入成员列表和动态。
  - 支持退出俱乐部，也可以重新加入。
- 本地导入/导出备份已包含 `clubs` 数据。

### 我的页面

- 已重做为移动端个人中心。
- 包含个人概览、账号同步、网页工具、信用徽章、备份和诊断等分组。
- Supabase URL / anon key 不再要求普通用户填写。
- 云端未配置时支持本地测试账号，方便开发阶段继续添加书籍和借书。
- 有应用诊断卡片，可显示在线状态、构建号、缓存状态、本地数据数量、错误日志/最近崩溃，并支持检查更新、重新加载、清理缓存、清除日志。
- 有本地数据导入/导出备份。

### Supabase / Web Push / 地图

- 已预留 Supabase Auth + Postgres 配置。
- 已预留 `airlink_user_data` 和 `airlink_push_subscriptions` 表结构说明。
- 已新增真实业务表结构草案：
  - 说明文档：`SUPABASE_SCHEMA.md`
  - SQL 草案：`supabase/linknest_schema.sql`
  - 覆盖用户、书籍、好友关系、俱乐部、俱乐部成员、俱乐部动态、消息会话、借阅记录、评价和基础 RLS。
- 已评审并加强 Supabase 草案：
  - `auth.users` 新用户会自动创建 `profiles`。
  - 俱乐部新增 `join_policy = open / approval / invite`，为私密/邀请码俱乐部预留结构。
  - 借阅记录新增服务端状态流转校验，限制借书者和出借者各自可执行的状态变更。
- 第一阶段 profile 迁移已开始：
  - 登录 Supabase 后前端会 upsert `profiles`。
  - 昵称、手机号会同步到 `profiles` / `profile_private`。
  - 原 `airlink_user_data` 云端备份仍保留为 fallback，书架等业务数据尚未迁移。
- 已新增 Web Push 订阅入口。
- 已新增 Supabase Edge Function `send-push`，用于实际发送 Web Push。
- Service Worker 支持 `push` 与 `notificationclick`。
- 已新增地图服务配置，支持 Google Maps 或高德 Web JS API。
- 未配置真实地图时保留模拟地图。

### UI 状态

最近一次大 UI 更新是参考用户提供的薄荷绿色书籍社区界面：

- 首页背景改为浅薄荷绿。
- 主要品牌色改为墨绿/薄荷绿。
- 书籍卡片为白色圆角卡片、细绿色边框、轻阴影。
- 分类胶囊和搜索框更接近参考图。
- 底部导航改为线性图标和绿色选中态。
- 书架、消息、聊天、社区页面基本统一到薄荷绿/墨绿色风格。
- 位置弹层、创建账号页、添加书籍页已统一到薄荷绿/墨绿色风格。
- 已做移动端 PWA 细节修复：统一安全区变量、底部导航在键盘弹起时让位、聊天输入框贴近键盘、底部弹窗补安全区和 iOS 惯性滚动，输入框字号避免 iPhone Safari 自动放大。
- 已做第一轮核心 UI 评审后的改版：
  - 附近列表新增“邻里书架”信息摘要，搜索/分类区更收敛。
  - 书籍卡片改成更有真实书封、书脊和纸张感的样式，弱化普通数据卡片感。
  - 书籍详情页重构为“封面 + 书主信用 + 借阅判断 + 底部申请动作”的转化布局。
- 已开始面向北美市场的英文版改造：
  - HTML 语言、页面标题、底部导航、附近页、书架页、添加书籍流程和主要 demo 数据已切到英文。
  - 书架页顶部三段 tab 已改为 `Library / Borrowed / Saved` 三张 shelf cards，并移除书架页重复悬浮添加按钮。
  - Nearby 默认切到列表视图，按轻纸感参考稿重做顶部、搜索、分类和书籍卡片，并移除 `Neighborhood shelf` 摘要栏目；地图仍可从右侧切换进入。
  - 保留中文分类/品相 alias，兼容旧 localStorage 里已有的中文数据。

注意：目前英文版已覆盖主要高频可见界面，但少量低频诊断、扫码/相机错误和开发配置文案仍可继续细化。

## 重要限制与现状

- 当前主要数据仍在 localStorage / demo 数据中。
- Supabase 还没有完全接管真实业务数据。
- 登录注册处于开发测试可用状态，不是最终上线版。
- Web Push 需要 HTTPS、VAPID key 和 Edge Function 部署后才能真实发送。
- 地图 API 需要真实 key 才能加载真实地图。
- 代码目前集中在 `index.html`，后续如果功能继续变大，建议拆分成 Vite + React 组件结构。

## 下一步建议

### 第一阶段：把数据真正接入 Supabase

已先完成表结构设计草案，迁移时建议按以下顺序逐步接入：

- `profiles` / `profile_private`
- `books`
- `friendships`
- `clubs` / `club_members` / `club_activities`
- `borrow_records`
- `conversations` / `conversation_participants` / `messages`
- `book_reviews` / `borrower_reviews`

然后逐步把 localStorage 替换为 Supabase 查询和写入。

重点要实现的权限：

- 游客只能看公开书。
- 登录用户可看公开书和好友开放书。
- 仅自己可见的书只能本人看到。
- 只有书籍拥有者可以编辑/删除自己的书。
- 只有相关借阅双方可以看到对应消息和借阅记录。

### 第二阶段：完善 Auth

- 保留游客浏览。
- 添加书、申请借书、加好友、评论时再要求登录。
- 登录后绑定用户资料、头像、昵称、社区位置。
- 去掉所有面向普通用户的 Supabase 技术配置入口。

### 第三阶段：真实借阅和消息状态机

需要把以下状态做成真实数据库状态：

- 申请借书
- 出借者同意/拒绝
- 协调见面
- 确认借出
- 申请归还
- 出借者同意新归还日期
- 确认收到归还
- 双方评价

消息页应由这些事件自动生成会话和未读提醒。

### 第四阶段：图片上传

- 使用 Supabase Storage 存书籍照片和头像。
- 添加书籍时上传图片并保存 URL。
- 书籍列表和详情页显示真实图片。

### 第五阶段：统一全局 UI

继续按照薄荷绿参考图统一：

- 消息页
- 好友/社区页
- 我的页面
- 书籍详情页
- 添加书籍页
- 登录注册页

整体保持：

- 浅薄荷背景
- 墨绿色主文字
- 白色圆角卡片
- 细绿色边框
- 轻阴影
- 友好的社区阅读感

### 第六阶段：上线能力

- 部署 Supabase Edge Function。
- 配置真实 Web Push VAPID。
- 配置 Google Maps 或高德地图。
- 做 GitHub Pages / Vercel 正式环境变量方案。
- 进行移动端真机测试。

## 常用命令

进入项目目录：

```bash
cd "/Users/john/Documents/LinkNest -old/LinkNest-old/airlink"
```

启动开发服务：

```bash
npm run dev
```

构建：

```bash
npm run build
```

检查 Service Worker 语法：

```bash
node --check sw.js
```

检查 Git 状态：

```bash
git status --short
```

推送到 GitHub：

```bash
GIT_SSH_COMMAND="ssh -i ~/.ssh/airlink_github" git push origin main
```

## 给新对话的开场建议

可以复制下面这段给 Codex：

```text
请继续开发 LinkNest PWA。项目目录是：
/Users/john/Documents/LinkNest -old/LinkNest-old/airlink

请先阅读 PROJECT_STATUS.md、README.md 和 index.html，了解当前状态。当前项目是手机网页版 PWA，优先开发邻里/好友共享书籍功能。下一步我想继续推进真实 Supabase 数据存储、登录注册、消息和借阅流程，或者继续统一 UI。
```
