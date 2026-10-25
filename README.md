# dsh-qq2006

把 DeepSeek Harness 的 Web 界面变回 2006 年的那个蓝色小企鹅。

用 **TypeScript + React TSX** 重写的 QQ2006 皮肤插件。它针对当前 DSH（`0.2.1-rc.3`）的插件机制重做，而不是沿用旧版的写法：旧版把整套逻辑手写成一个 `runtime.js`，并且通过 `theme.register` / 可选 Host peer（`dsh-settings`、`schemastery`）去挂设置项，依赖一改就静默失效。

```
设置 → 通用 → QQ2006 皮肤         ← 一行开关 + 四格配色
设置 → QQ2006 皮肤               ← 皮肤中心：开关、四套预设、复古宋体选项
输入框上方的工具栏                ← 原版 16×16 小工具栏图标
```

## 效果

- **整站配色**：珊瑚蓝窗口、浅蓝侧栏、蓝色标题行、白色列表、经典 1px 蓝边。
- **复古排版**：宋体 12px（可关闭），方角控件、经典凹陷滚动条、Windows 蓝选中色。
- **深浅无关**：QQ2006 只有一套浅色皮肤。开启期间外观被固定为浅色（包括之后手动选深色），
  关闭时恢复你原本的选择，避免深色残留把浅色窗口涂花。
- **窗口化控件**：对话框 / 菜单 / 输入框换成 2006 年的边框与凹陷效果。
- **原版素材**：企鹅图标与 16×16 小工具栏图标，按原生尺寸绘制。
- **可切换、可持久化、零污染**：开关状态存在本浏览器，换肤入口只留在设置里；关闭后品牌位、工具栏、输入框、配色全部还原，默认皮肤不受影响。

## 安装

### Desktop 版

在 DSH 桌面端的插件安装入口里**直接填写插件名称** `dsh-qq2006` 即可。

### Web 版

```sh
dsh plugin --profile web add dsh-qq2006
```

包内已包含编译产物（`lib/`），装完即用，不需要再构建。升级同样是再执行一次 `add`。

两版装完都**刷新一次页面**（新插件的浏览器产物需要重新拉取），然后到 `设置 → 通用` 打开「QQ2006 皮肤」。

> 本地开发时也可以直接从本仓库目录安装，改完源码重跑 `npm run build` 即可，不需要重新安装：
>
> ```sh
> npm install && npm run build
> dsh plugin add /path/to/dsh-qq2006
> ```
>
> 同一件事也可以交给 Agent，用 `plugin_manager` 的 `install_bundle` 指向该目录。

## 结构

```
package.json              dsh.bundle.patch + dsh.client(platform: web)
cordis.patch.yml          insert 一行 Loader 记录（不能用裸 { id, name }）
locale/{zh,en}.json       插件管理器里显示的名称与描述
icon.svg                  自绘图标
src/host/index.ts         Host 半边：空实现，不依赖任何 Host peer
src/client/
  index.tsx               apply：样式、调色板、body 作用域、7 个 slot 注册
  presets.ts              4 套配色 + 宿主 token 映射
  store.ts                localStorage 状态 + useSyncExternalStore
  assets.ts               原版素材（构建期内联为 data URL）
  client.css              全部皮肤样式（宿主规则一律以 body[data-dsh-qq2006] 为祖先）
  components/             设置行、皮肤中心、输入框工具栏、侧栏品牌件
scripts/build.mjs         Host(ESM) + Client(ModuleLoader 惰性工厂) 构建与校验
```

## 为什么这样写

**1. 浏览器产物必须是 ModuleLoader 惰性工厂。**
DSH 把 `lib/client.js` 当普通 `<script>` 加载，脚本唯一要做的事是
`window.__ModuleLoader__.load({ id: 包名, factory(require) {...} })`。因此构建用
esbuild 的 **CJS** 格式包一层外壳：平台模块编译成裸 `require("react")`，由宿主模块表解析；
IIFE 会生成 `__require` shim，运行时直接抛 `Dynamic require of "react" is not supported`。
构建脚本对这几条都有断言，产物不合格会构建失败而不是静默装不上。

**2. 不 import 任何 `@deepseek-ai/dsh-client-*`。**
那些包随宿主版本变动，且旧版正是依赖它们才失效。本插件只用 `ctx.get()`/`ctx.slots`/`ctx.theme`
这几个公开服务，并把用到的签名在 `src/client/types.ts` 里最小化声明。

**3. 不用宿主的 CSS Module 类名。**
DSH 的类名是构建期哈希，跨版本必变。全站的改色走公开的 `--dsw-alias-*` / `--dsw-specific-*`
token（同时在 `body[data-dsh-qq2006]` 作用域里重述一份，保证宿主刷新主题快照后仍然生效），
结构性的改造只落在公开契约上：元素、ARIA role、token。插件自己的界面用 `qq06-` 前缀的独立样式。

**4. `single` slot 的替换要按优先级。**
`sidebar.brand.mark` / `sidebar.brand.name` 是单选槽，渲染**优先级最低**的那一项；
所以替换项用 `priority: -1`，并且**只在皮肤开启时注册**，关闭即释放，品牌位立刻回到 DSH 原样。

**5. 状态放在浏览器。**
`localStorage`（`dsh.qq2006.skin.v1`）而不是 Host settings namespace：少一个会随上游变形的
peer 依赖，插件在任何 profile 里都能独立工作。

## 素材与版权

素材（企鹅图标与 8 个 16×16 工具栏图标）取自腾讯 QQ2006 原版客户端，经
[mengkunsoft/QQ2006](https://github.com/mengkunsoft/QQ2006) 整理，版权归腾讯公司所有，**仅供学习交流，请勿商用**。
`icon.svg` 为本项目自绘，不涉及第三方素材。

## 开发

```sh
npm install          # esbuild / typescript / @types/react
npm run typecheck    # tsc --noEmit
npm run build        # 产出 lib/index.js + lib/client.js
```

改完 `lib/client.js` 后，运行中的页面会通过 HMR 自动换成新产物；改 `package.json` 的
`dsh.client` 或 `cordis.patch.yml` 这类清单字段则需要重启 Host。
