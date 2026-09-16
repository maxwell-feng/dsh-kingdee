---
name: kingdee-bos
description: >-
  金蝶云星空（Kingdee Cloud Starry Sky）业务对象二次开发指导：字段与枚举约定、单据状态机、
  dsh-kingdee 工具的用法，以及 WebAPI 数据层与平台插件层的边界。
whenToUse: >-
  当任务涉及通过 dsh-kingdee 工具查询、创建、保存、提交、审核金蝶云星空的单据或基础资料，或需要
  理解金蝶字段/枚举/状态机约定时加载本技能。
---

# Kingdee BOS 二次开发（kingdee-bos）

本技能是 **dsh-kingdee** 插件的伴生领域知识，覆盖两件事：
1. 如何用插件提供的 `kingdee_*` 工具在金蝶云星空上做**数据/服务层**二开。
2. 金蝶业务对象的字段、枚举、状态机约定，以及**平台插件层**（C# 服务端插件/界面扩展）无法用 WebAPI 触达的边界。

> 工具能做什么是**能力**，这个技能是**怎么用**。二者配合：先读技能理解约定，再调工具执行动作。

## 工具总览

| 工具 | 作用 | 关键入参 |
|---|---|---|
| `kingdee_query` | ExecuteBillQuery 查单据/基础资料 | `formId`, `fieldKeys[]`, `filter?`, `orderString?`, `topCount?`, `limit?`, `startRow?`, `organization?` |
| `kingdee_save` | 保存/新增单据或基础资料 | `formId`, `data`, `interaction?`, `isAutoSubmitAndAudit?` |
| `kingdee_batch_save` | 单次批量保存多条 | `formId`, `records[]`, `interaction?`, `isAutoSubmitAndAudit?` |
| `kingdee_submit` | 提交 | `formId`, `ids[]`, `numbers?` |
| `kingdee_audit` | 审核 | `formId`, `ids[]`, `numbers?` |
| `kingdee_unaudit` | 反审核 | `formId`, `ids[]`, `numbers?` |
| `kingdee_unsubmit` | 反提交 | `formId`, `ids[]`, `numbers?` |
| `kingdee_delete` | 删除 | `formId`, `ids[]`, `numbers?` |
| `kingdee_delete_draft` | 删除草稿/暂存单 | `formId`, `ids[]`, `numbers?` |
| `kingdee_view` | 查看单据详情 | `formId`, `id?`, `number?` |
| `kingdee_query_business_data` | 新版**结构化**查询 | `formId`, `fieldKeys[]`, `filter?`, `orderString?`, `topCount?`, `limit?`, `startRow?`, `organization?` |
| `kingdee_invoke` | 调 BOS 自定义服务 | `serviceName`, `payload?`, `formId?` |
| `kingdee_list_datacenters` | 列出地址可达的数据中心/账套 | — |
| `kingdee_logout` | 退出当前会话 | — |

没有独立的“登录”工具：会话由任意业务工具在首个调用时按需建立并自动复用，`kingdee_logout` 用于显式释放。

> **端点名随版本有差异**：`LogOut`、`ListDataCenter`、`UnSubmit`、`DeleteDraft` 等接口的服务名随星空版本/部署可能不同。所有 stub 路径默认以 `.common.kdsvc` 结尾（V9.1 规范形式）。若某工具报业务错误或网络错误，请在配置 `serviceEndpoints` 中按该账套覆盖对应端点名（见 INSTALL / CONFIG）；该账套的权威端点与参数说明在 **公共设置 → 动态服务定义 → WebAPI**。

## 常用单据/基础资料 FormId（示例，按你的账套配置）

- 销售订单 `SAL_SaleOrder`
- 采购订单 `PUR_PurchaseOrder`
- 销售出库单 `SAL_OutStock`
- 销售发票 `SAL_SaleInvoice`
- 物料 `BD_MATERIAL`
- 客户 `BD_Customer`
- 供应商 `BD_Supplier`

> 具体 FormId 以你的金蝶账套为准；可以在开发环境用 `kingdee_query` 结合业务查询接口确认。

## 关键字段与枚举约定

- **FDocumentStatus**（单据状态）：`Z`=创建/暂存，`A`=已提交，`C`=已审核，`D`=已作废，`E`=重新审核。
- **单据编号**：`FBillNo`；**内码**：`FID`；**单据头内码**：`FID`。
- **物料**：`FMATERIALID`（内码引用）、`FMaterialNumber`（编码）；**客户/供应商**：`FCUSTID`/`FSUPPLIERID`。
- **组织**：`FUSEORGID`（使用组织），业务对象常按组织/单据类型隔离。
- **计量单位**：`FUNITID`；**仓库**：`FSTOCKID`。
- **金额/数量**：通常带 `F` 前缀字段（`FALLAMOUNTFOR`、`FQty` 等），注意精度与舍入。

> 以上是通用约定；**具体字段要用 `kingdee_query` 在目标账套上核对**，不要凭记忆硬编码。

## 单据状态机

`创建(暂存)` → `提交` → `审核` → `反审核` → `反提交` → `删除草稿/作废`。典型约束：

- **提交前**：必须完成保存并具有合法编号；缺必填项时提交/审核会失败并返回 `Message`。
- **审核**：只有已提交的单据可审核；审核后多数单据不可直接编辑/删除。
- **反审核**：通常在单据状态 `C`（已审核）时执行；有下游单据引用时可能被拒。
- **反提交**：把已提交但未审核的单据退回；对应 `kingdee_unsubmit`。
- **删草稿**：删除已保存但未提交的暂存/创建单；对应 `kingdee_delete_draft`，注意别与 `kingdee_delete`（删除已提交单据）混淆。
- 调用 `kingdee_save` 时若 `interaction: true` 会**跳过**平台表单插件校验——慎用，仅当你明确要绕过校验时。批量可用 `kingdee_batch_save`（多条一次），结构化查询优先用 `kingdee_query_business_data`。

## 查询与分页（V9.1 规范）

- **稳定游标三件套**：`orderString` + `limit` + `startRow`。**分页必须给 `orderString` 一个全序字段**（如 `FModifyDate ASC` 或 `FBillNo ASC`）；不排序时分页会跳行/重行，这是工程硬要求而非接口硬要求。
- **判定末页**：返回行数 **< `limit`** 即到末页；不要依赖总行数。
- **单页行数**：默认取 `limit` 时请自取上限（社区一致经验值约 2000 行/页，官方未公布硬上限）；**不要**用 `topCount` 做分页控制，也不要指望超大 `limit` 一次取全量。
- **增量同步**：用 `filter` 按修改时间做增量（如 `FModifyDate >= '...'`），比纯大偏移分页更稳。字符串字面量按金蝶约定处理转义。
- **FieldKeys 必须真实存在**：写了不存在的字段标识会导致**整次调用失败**，而不是该字段为空——先 `kingdee_query` 小样本核对字段。
- **权限**：V9.1 收紧了 WebAPI 外部用户访问权限管控，缺权限时可能返回**空结果而非报错**。若查询意外为空，先确认集成用户对该 `FormId` 有查询权限，不要直接判定“没有数据”。

## 幂等与重试（V9.1 规范）

- V9.1 官方在线文档新增了**设置幂等性校验**说明。**不要把“超时后重发保存”当作安全操作**：重发前先用 `kingdee_query` 按单据编号回查确认是否已写入（`FBillNo` + 分录序号可作业务幂等键）。
- V9.1 为 WebAPI 限流提供白名单机制：请把调用方出口 IP 加入该白名单，并对限流/超时做**指数退避 + 抖动**重试；不要假定任何固定的 QPS 配额。
- V9.1 起服务端会**记录 WebAPI 请求报文日志**。在条件允许时优先使用 `app`（第三方应用）模式，减少明文口令进入报文的场景。
- V9.1 修复了 `Delete` 返回结果中 `FNumber` 不正确的问题：从 `9.1.0.20250807` 起可直接信任 `SuccessEntitys[].Number`，无需再用 `Id` 反查编号。

## 数据/服务层二开流程（推荐序列）

1. `kingdee_query` 核对目标单据/基础资料的 FormId 与字段。
2. 构造 `data`，用 `kingdee_save` 创建或更新记录；读取返回的 `Id`/`Number`。
3. 用 `kingdee_submit` 提交，用 `kingdee_audit` 审核。
4. 用 `kingdee_invoke` 调用你二开创建的 BOS 自定义服务完成平台插件层逻辑（如校验、回写、触发流程）。`serviceName` 传**该账套真实的 stub 路径**，格式为 `{命名空间}.{类名}.{方法},{组件名}`（例：`GetCust.GetCust.ExecuteService,GetCust`）——它**替换**URL 中的 `DynamicFormService` 段，`.common.kdsvc` 由插件自动补全。
5. 用 `kingdee_query` 回查结果核对。

> 自定义 BOS 服务需在金蝶侧继承 `AbstractWebApiBusinessService`、构造函数取 `KDServiceContext`，并把 DLL 部署到 `WebSite\bin` 后重启 IIS；服务收到的业务参数即 `payload` 对象。

## 平台插件层边界（重要）

- **WebAPI 覆盖**：数据读写、字段/单据操作、调用 BOS 自定义服务。
- **WebAPI 不覆盖**：在表单/列表上挂 **C# 服务端插件**、改界面布局、写后台事件。这类要**在金蝶侧 BOS 集成开发环境**编译并上传 DLL 到服务器，**不是** `kingdee_*` 工具能触达的。
- **跨界衔接**：平台插件层产生的效果，通常通过它暴露的**自定义服务**（`kingdee_invoke`）或**表单/数据结果**（`kingdee_query`/`kingdee_save`）与数据层对接。

## Mock 演示

在没有真实金蝶实例时，把插件配置里的 `mock: true` 打开，`kingdee_*` 会用本地固化的信封跑通流程（返回形如 `SO-MOCK-1` 的数据），用于演示与测试，不连接真实账套。

## 常见错误

- `IsSuccess=false` 且 `Message` 提示缺少字段/数据 → 补全必填字段，核对 `FormId`、字段名。
- 认证失败 → 检查 `acctId`、账套用户名密码（`user` 模式）或 `appId`/`appSecret` + 集成用户名（`app` 模式），确认 WebAPI 已启用、账号未被锁定。
- **公有云开通于 2022-11-29 之后、且为 V8.1 起的租户**：金蝶**不再接受账号密码登录**，必须改用 `app`（第三方系统登录授权）模式；且需先把调用方出口 IP 加入「第三方系统登录授权」的白名单列表。
- 查询返回**空集**但你认为应有数据 → 先查权限（V9.1 权限收紧后无权限可能表现为空结果而非报错），再查 `filter` 与 `FieldKeys` 是否正确。
- 单据状态不可执行该操作 → 检查 `FDocumentStatus` 与状态机顺序。
- 保存/提交超时后**不要盲目重发** → 先按单据编号回查确认是否已落库（V9.1 幂等要求）。

> 遇到具体字段/校验报错，优先用 `kingdee_query` 在目标账套核对，而不是凭常识猜测。
