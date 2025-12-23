# 📄 MVP 设计文档

**项目名（暂定）**：`py-deps-hint`
**一句话描述**：在 VS Code 的 `requirements.txt` 中，以行内提示的方式显示每个依赖的最新兼容版本。

---

## 1. MVP 的「问题定义」

### 核心问题

在日常 Python 开发中：

* 依赖版本写在文本里
* 无法一眼知道：

  * 现在是否落后
  * 在当前约束下能升级到哪里
* 需要：

  * 打开 PyPI
  * 查版本
  * 手算区间

👉 **信息获取成本过高，且高度重复**

---

## 2. MVP 的「成功标准」

> **成功不是“功能多”，而是“你会不会一直开着它”**

MVP 达成标准（必须全部满足）：

* 打开 `requirements.txt`
* 每一条合法依赖：

  * 自动显示一条**行内小字提示**
  * 告诉我「latest compatible version」
* 不修改文件内容
* 不明显拖慢编辑器
* 可随时关闭

---

## 3. MVP 明确「不做什么」

**以下内容一律不做（第一版）**：

* ❌ 自动升级 / 一键改版本
* ❌ 依赖冲突分析
* ❌ 全项目依赖图
* ❌ pip / poetry / uv 集成
* ❌ CI / terminal 交互
* ❌ 多文件格式（如 `pyproject.toml`）

> 原则：
> **编辑器负责“提示”，工具负责“决策”**

---

## 4. 支持的输入格式（严格限定）

### 支持 ✅

```txt
requests==2.31.0
Django>=3.2,<4.0
numpy>=1.23
pydantic
```

### 明确不支持 ❌（直接忽略）

```txt
-e git+https://...
./local_package
-r other.txt
```

---

## 5. 核心功能设计

### 5.1 触发条件

* 文件类型：`requirements.txt`
* 触发时机：

  * 文件打开
  * 文件内容变更（防抖）

---

### 5.2 依赖解析规则（MVP 级）

对每一行：

1. 去除空行 / 注释
2. 用正则识别：

   ```regex
   ^([a-zA-Z0-9._-]+)\s*(.*)?$
   ```
3. 提取：

   * package name
   * version specifier（可能为空）

⚠️ **不做复杂 PEP 440 特例处理**

---

### 5.3 版本信息获取

#### 数据源

* PyPI JSON API
  `https://pypi.org/pypi/{package}/json`

#### 获取内容

* 所有 release 版本号
* release 是否为 pre-release（可选）
* `requires_python`（暂不使用）

---

### 5.4 “latest compatible” 计算规则（MVP）

1. 若无 version specifier：

   * 取 PyPI 上的 **latest stable**
2. 若有 specifier：

   * 过滤所有版本
   * 找到 **满足 specifier 的最大版本**

**预发布版本（alpha / beta / rc）默认排除**

---

## 6. UI / 交互设计

### 6.1 展示形式（唯一方式）

**Inlay Hint（行内提示）**

示例：

```txt
Django>=3.2,<4.0        ⟶ latest: 3.2.25
requests==2.31.0       ⟶ latest: 2.32.3
```

设计原则：

* 字体小
* 颜色弱
* 永远不抢正文注意力

---

### 6.2 用户配置（最少）

```json
"pyDepsHint.enabled": true
"pyDepsHint.showPrerelease": false
"pyDepsHint.cacheTTLMinutes": 60
```

---

## 7. 性能与缓存策略（非常重要）

### 必须做的三点

1. **本地缓存 PyPI 查询结果**

   * key: package name
   * value: version list + timestamp
2. **防抖处理**

   * 编辑时不立即请求
3. **并发限制**

   * 同时最多 N 个请求（如 5）

> MVP 原则：
> **慢一点没关系，不能卡**

---

## 8. 错误与边界处理

| 场景        | 行为                         |
| --------- | -------------------------- |
| 包不存在      | 不显示提示                      |
| PyPI 请求失败 | 静默失败                       |
| 解析失败      | 忽略该行                       |
| 无兼容版本     | 显示 `no compatible version` |

---

## 9. 技术选型（约束你自己）

* VS Code Extension API
* TypeScript
* fetch / axios
* 简单版本比较逻辑（自写或轻量库）

🚫 不引入大型依赖解析库

---

## 10. MVP 开发里程碑（现实可行）

### Phase 1（可运行）

* 插件能加载
* 能识别 requirements.txt
* 能发请求拿到 PyPI 数据

### Phase 2（可用）

* 正确计算 latest compatible
* Inlay Hint 正常显示
* 缓存生效

### Phase 3（可发布）

* 设置项
* README
* Marketplace 发布

---

## 11. MVP 的“止损点”

如果出现以下情况，**立刻停手收敛**：

* 想支持 pyproject.toml
* 想分析依赖冲突
* 想“顺手”做升级按钮
* 想完全实现 PEP 440

👉 那不是 MVP，那是新产品

---

## 12. 一句话自检

> **如果我现在关掉插件，我会不会立刻觉得不方便？**

能回答“会”，这个 MVP 就成功了。