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
| `kingdee_login` | 建会话/取票据（通常由工具自动完成） | — |
| `kingdee_query` | ExecuteBillQuery 查单据/基础资料 | `formId`, `fieldKeys[]`, `filter?`, `topCount?`, `organization?` |
| `kingdee_save` | 保存/新增单据或基础资料 | `formId`, `data`, `interaction?` |
| `kingdee_submit` | 提交 | `formId`, `ids[]`, `numbers?` |
| `kingdee_audit` | 审核 | `formId`, `ids[]` |
| `kingdee_unaudit` | 反审核 | `formId`, `ids[]` |
| `kingdee_view` | 查看单据详情 | `formId`, `id` |
| `kingdee_delete` | 删除 | `formId`, `ids[]` |
| `kingdee_invoke` | 调 BOS 自定义服务 | `serviceName`, `payload?`, `formId?` |
| `kingdee_logout` | 退出当前会话 | — |
| `kingdee_list_datacenters` | 列出地址可达的数据中心/账套 | — |
| `kingdee_query_business_data` | 新版**结构化**查询 | `formId`, `fieldKeys[]`, `filter?`, `topCount?`, `organization?` |
| `kingdee_unsubmit` | 反提交 | `formId`, `ids[]` |
| `kingdee_delete_draft` | 删除草稿/暂存单 | `formId`, `ids[]` |
| `kingdee_batch_save` | 单次批量保存多条 | `formId`, `records[]`, `interaction?` |

> **端点名随版本有差异**：`LogOut`、`ListDataCenter`、`UnSubmit`、`DeleteDraft` 等接口的服务名随星空版本/部署可能不同。若某工具报 `kd/not-found` 或断言到不存在的服务，请在配置 `serviceEndpoints` 中按该账套覆盖对应端点名（见 INSTALL）。

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

## 数据/服务层二开流程（推荐序列）

1. `kingdee_query` 核对目标单据/基础资料的 FormId 与字段。
2. 构造 `data`，用 `kingdee_save` 创建或更新记录；读取返回的 `Id`/`Number`。
3. 用 `kingdee_submit` 提交，用 `kingdee_audit` 审核。
4. 用 `kingdee_invoke` 调用你二开创建的 BOS 自定义服务完成平台插件层逻辑（如校验、回写、触发流程）。
5. 用 `kingdee_query` 回查结果核对。

## 平台插件层边界（重要）

- **WebAPI 覆盖**：数据读写、字段/单据操作、调用 BOS 自定义服务。
- **WebAPI 不覆盖**：在表单/列表上挂 **C# 服务端插件**、改界面布局、写后台事件。这类要**在金蝶侧 BOS 集成开发环境**编译并上传 DLL 到服务器，**不是** `kingdee_*` 工具能触达的。
- **跨界衔接**：平台插件层产生的效果，通常通过它暴露的**自定义服务**（`kingdee_invoke`）或**表单/数据结果**（`kingdee_query`/`kingdee_save`）与数据层对接。

## Mock 演示

在没有真实金蝶实例时，把插件配置里的 `mock: true` 打开，`kingdee_*` 会用本地固化的信封跑通流程（返回形如 `SO-MOCK-1` 的数据），用于演示与测试，不连接真实账套。

## 常见错误

- `IsSuccess=false` 且 `Message` 提示缺少字段/数据 → 补全必填字段，核对 `FormId`、字段名。
- 认证失败 → 检查 `acctId`/`appId`/`appSecret` 或账套用户名密码，确认 WebAPI 已启用。
- 单据状态不可执行该操作 → 检查 `FDocumentStatus` 与状态机顺序。

> 遇到具体字段/校验报错，优先用 `kingdee_query` 在目标账套核对，而不是凭常识猜测。
