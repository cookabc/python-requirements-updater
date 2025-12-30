# py-deps-hint

在 VS Code 中为 `requirements.txt` 文件显示 Python 依赖的最新兼容版本。

## ✨ 功能特性

- 🔍 **智能版本检测** - 自动识别 `requirements.txt` 文件并显示版本信息
- 🎯 **风险分析** - 区分安全更新（补丁/小版本）和风险更新（大版本）
- 🖱️ **一键更新** - 点击版本提示即可更新到最新版本
- ⚠️ **安全确认** - 大版本更新时显示确认对话框，防止破坏性变更
- 📊 **状态栏显示** - 实时显示可更新包的数量
- 🌍 **多语言支持** - 支持中文、英文、日文、韩文等多种语言
- 💾 **智能缓存** - 减少网络请求，提升响应速度

## 🚀 使用方法

1. 打开任意 `requirements.txt` 文件
2. 插件会自动显示每个依赖的状态：
   - `✓ 已是最新` - 包已是最新版本
   - `↗ 更新到 X.X.X` - 有安全更新可用（点击更新）
   - `⚠️ 更新到 X.X.X Major` - 有大版本更新（谨慎更新）

### 批量更新

- 点击状态栏的更新提示
- 或使用命令面板：`Ctrl+Shift+P` → "Update All Packages"
- 自动区分安全更新和风险更新，提供选择

## ⚙️ 配置选项

| 设置 | 默认值 | 说明 |
|------|--------|------|
| `pyDepsHint.enabled` | `true` | 启用/禁用插件 |
| `pyDepsHint.showPrerelease` | `false` | 是否显示预发布版本 |
| `pyDepsHint.cacheTTLMinutes` | `60` | 缓存有效期（分钟） |

## 🏗️ 项目结构

```
src/
├── core/           # 核心逻辑
│   ├── cache.ts           # 缓存管理
│   ├── parser.ts          # 依赖解析
│   ├── versionAnalyzer.ts # 版本风险分析
│   └── versionResolver.ts # 版本解析
├── providers/      # 服务提供者
│   ├── codeLensProvider.ts # CodeLens 提供者
│   ├── pypiClient.ts      # PyPI API 客户端
│   └── versionService.ts  # 版本服务
├── utils/          # 工具函数
│   ├── configuration.ts   # 配置管理
│   ├── i18n.ts           # 国际化
│   └── statusBar.ts      # 状态栏管理
├── types/          # 类型定义
│   └── index.ts
└── extension.ts    # 插件入口
```

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 编译
npm run compile

# 运行测试
npm test

# 打包
npx vsce package
```

## 📄 License

MIT
