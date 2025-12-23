# py-deps-hint

在 VS Code 中为 `requirements.txt` 文件显示 Python 依赖的最新兼容版本。

## 功能

- 自动识别 `requirements.txt` 文件
- 在每行依赖后显示最新兼容版本
- 支持版本约束（`>=`, `<=`, `==`, `!=`, `>`, `<`, `~=`）
- 智能缓存，减少网络请求
- 默认排除预发布版本

## 安装

1. 在 VS Code 扩展市场搜索 "Python Dependencies Hint"
2. 点击安装

或者从 VSIX 文件安装：
```bash
code --install-extension py-deps-hint-0.0.1.vsix
```

## 使用

打开任意 `requirements.txt` 文件，插件会自动在每行依赖后显示版本提示：

```
Django>=3.2        ⟶ latest: 5.0.1
requests           ⟶ latest: 2.31.0
numpy>=1.20,<2.0   ⟶ latest: 1.26.3
```

## 配置

| 设置 | 默认值 | 说明 |
|------|--------|------|
| `pyDepsHint.enabled` | `true` | 启用/禁用插件 |
| `pyDepsHint.showPrerelease` | `false` | 是否显示预发布版本 |
| `pyDepsHint.cacheTTLMinutes` | `60` | 缓存有效期（分钟） |

## 开发

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

## License

MIT
