---
name: kingdee-bos
description: >-
  金蝶云·星空（Kingdee Cloud Starry Sky）业务对象二次开发指导：字段/枚举、单据状态机、
  dsh-kingdee 工具用法，以及 WebAPI 数据层与平台插件层边界。
whenToUse: >-
  当任务涉及用 dsh-kingdee 查询、创建、保存、提交或审核金蝶云·星空单据/基础资料，或需
  理解字段/枚举/状态机时加载。
---

# Kingdee BOS 二次开发（kingdee-bos）

本技能是 **dsh-kingdee** 的伴生领域知识：用 `kingdee_*` 工具做**数据/服务层**二开，并说明字段、枚举、状态机约定及**平台插件层**（C# 服务端插件/界面扩展）的 WebAPI 边界。先读约定，再调工具。

## 工具总览

| 工具 | 作用 | 关键入参 |
|---|---|---|
| `kingdee_query` | ExecuteBillQuery 查单据/基础资料 | `formId`, `fieldKeys[]`, `filter?`, `orderString?`, `topCount?`, `limit?`, `startRow?`, `organization?` |
| `kingdee_query_business_data` | 新版**结构化**查询 | `formId`, `fieldKeys[]`, `filter?`, `orderString?`, `topCount?`, `limit?`, `startRow?`, `organization?` |
| `kingdee_save` | 保存/新增单据或基础资料 | `formId`, `data`, `interaction?`, `isAutoSubmitAndAudit?` |
| `kingdee_batch_save` | 单次批量保存多条 | `formId`, `records[]`, `interaction?`, `isAutoSubmitAndAudit?` |
| `kingdee_submit` | 提交 | `formId`, `ids[]` / `numbers[]` |
| `kingdee_unsubmit` | 反提交 | `formId`, `ids[]` / `numbers[]` |
| `kingdee_audit` | 审核 | `formId`, `ids[]` / `numbers[]` |
| `kingdee_unaudit` | 反审核 | `formId`, `ids[]` / `numbers[]` |
| `kingdee_view` | 查看单据详情 | `formId`, `id` / `number` |
| `kingdee_delete` | 删除 | `formId`, `ids[]` / `numbers[]` |
| `kingdee_delete_draft` | 删除草稿/暂存单 | `formId`, `ids[]` / `numbers[]` |
| `kingdee_invoke` | 调 BOS 自定义服务 | `serviceName`, `payload?`, `formId?` |
| `kingdee_logout` | 退出当前会话 | — |
| `kingdee_list_datacenters` | 列出地址可达的数据中心/账套 | — |

没有独立登录工具：除 `kingdee_list_datacenters` 外，业务工具首次调用时按需建立会话并复用；`kingdee_logout` 显式释放。

> **端点名随版本有差异**：`LogOut`、`ListDataCenter` 等服务名随版本/部署而异；`UnSubmit`、`DeleteDraft` 等动态表单操作名不可单独覆盖。stub 默认以 `.common.kdsvc` 结尾。仅在工具报未知服务或 HTTP 404 时，才按账套在 `serviceEndpoints` 覆盖端点名（见 INSTALL / CONFIG）；字段、状态或权限等业务错误与端点无关。权威端点与参数见 **公共设置 → 动态服务定义 → WebAPI**。

## 常用单据/基础资料 FormId（示例，按你的账套配置）

- 销售订单 `SAL_SaleOrder`
- 采购订单 `PUR_PurchaseOrder`
- 销售出库单 `SAL_OutStock`
- 销售发票 `SAL_SaleInvoice`
- 物料 `BD_MATERIAL`
- 客户 `BD_Customer`
- 供应商 `BD_Supplier`

> 具体 FormId 以账套为准，可用 `kingdee_query` 在开发环境确认。

## 关键字段与枚举约定

- **FDocumentStatus**（单据状态）：`Z`=暂存，`A`=创建（已保存），`B`=审核中（已提交），`C`=已审核，`D`=重新审核。部分单据另有 `E`=作废，或以单独的作废状态字段表示。
- **单据编号**：`FBillNo`；**内码**：`FID`。
- **物料**：`FMaterialId`（内码引用）、`FMaterialId.FNumber`（编码）；**客户/供应商**：`FCustId`/`FSupplierId`。
- **组织**：`FUseOrgId`（使用组织），业务对象常按组织/单据类型隔离。
- **计量单位**：`FUnitId`；**仓库**：`FStockId`。
- **金额/数量**：通常带 `F` 前缀字段（`FALLAMOUNTFOR`、`FQty` 等），注意精度与舍入。

> 以上为通用约定；**具体字段须用 `kingdee_query` 在目标账套核对**，不要凭记忆硬编码。

## 单据状态机

`暂存(Z)` → `保存/创建(A)` → `提交/审核中(B)` → `审核/已审核(C)` → `反审核/重新审核(D)`；反提交用于已提交/审核中（`B`）的单据，退回可编辑状态（BOS 文档常记为 `B→D`，以账套为准）；草稿可删，作废仅适用于已审核单据。

- **提交前**：必须完成保存并具有合法编号；缺必填项时提交/审核会失败并返回 `Message`。
- **审核**：只有已提交的单据可审核；审核后多数单据不可直接编辑/删除。
- **反审核**：通常在 `C`（已审核）时执行；有下游单据引用时可能被拒。
- **反提交**：把已提交、仍在审核中（`B`）的单据退回可编辑状态；对应 `kingdee_unsubmit`。
- **删草稿**：删除 `Z`（暂存）草稿；对应 `kingdee_delete_draft`，别与 `kingdee_delete`（普通删除，通常需先反审核/反提交）混淆。
- `kingdee_save` 的 `interaction: true` 会**跳过**平台表单插件校验，慎用；批量可用 `kingdee_batch_save`（多条一次），结构化查询优先 `kingdee_query_business_data`。

## 查询与分页（V9.1 规范）

- **稳定游标三件套**：`orderString` + `limit` + `startRow`。分页必须给 `orderString` 全序字段（如 `FModifyDate ASC`/`FBillNo ASC`）；不排序会跳行/重行，这是工程硬要求而非接口硬要求。
- **判定末页**：返回行数 **< `limit`** 即到末页；不要依赖总行数。
- **单页行数**：未指定 `limit` 时请设安全上限（社区经验值约 2000 行/页，官方未公布硬上限）；不要用 `topCount` 做分页，也不要指望超大 `limit` 一次取全量。
- **增量同步**：用 `filter` 按修改时间增量（如 `FModifyDate >= '...'`），比大偏移分页更稳。字符串字面量按金蝶约定转义。
- **FieldKeys 必须真实存在**：不存在的字段标识会导致**整次调用失败**，不是该字段为空；先用 `kingdee_query` 小样本核对。
- **权限**：V9.1 收紧了 WebAPI 外部用户权限；缺权限时可能返回**空结果而非报错**。查询意外为空时，先确认集成用户对该 `FormId` 的查询权限，不要直接判定“没有数据”。

## 幂等与重试（V9.1 规范）

- V9.1 官方文档新增了**幂等性校验**说明。**不要把“超时后重发保存”当作安全操作**：重发前先用 `kingdee_query` 按单据编号回查（`FBillNo` + 分录序号可作业务幂等键）。
- V9.1 的 WebAPI 限流提供白名单：请加入调用方出口 IP，并对限流/超时做**指数退避 + 抖动**重试；不要假定固定 QPS。
- V9.1 起服务端会**记录 WebAPI 请求报文日志**；条件允许时优先用 `app`（第三方应用）模式，减少明文口令进入报文。
- V9.1 修复了 `Delete` 返回 `FNumber` 不正确的问题：从 `9.1.0.20250807` 起可直接信任 `SuccessEntitys[].Number`，无需用 `Id` 反查。

## 数据/服务层二开流程（推荐序列）

1. `kingdee_query` 核对目标单据/基础资料的 FormId 与字段。
2. 构造 `data`，用 `kingdee_save` 创建或更新记录；读取返回的 `Id`/`Number`。
3. 用 `kingdee_submit` 提交，用 `kingdee_audit` 审核。
4. 用 `kingdee_invoke` 调用自建 BOS 服务完成平台插件层逻辑（如校验、回写、触发流程）。`serviceName` 传**账套真实 stub 路径**（格式 `{命名空间}.{类名}.{方法},{组件名}`，例 `GetCust.GetCust.ExecuteService,GetCust`），它**替换** `DynamicFormService` 段，`.common.kdsvc` 自动补全。
5. 用 `kingdee_query` 回查结果核对。

> 自定义 BOS 服务需继承 `AbstractWebApiBusinessService`、构造函数接收 `KDServiceContext`，DLL 部署到 `WebSite\bin` 后重启 IIS；服务收到的业务参数即 `payload`。

## 平台插件层边界（重要）

- **WebAPI 覆盖**：数据读写、字段/单据操作、调用 BOS 自定义服务。
- **WebAPI 不覆盖**：表单/列表上的 **C# 服务端插件**、界面布局、后台事件。这类需在**金蝶 BOS 集成开发环境**编译并上传 DLL 到服务器，**不是** `kingdee_*` 工具能触达的。
- **跨界衔接**：平台插件层的效果通常通过**自定义服务**（`kingdee_invoke`）或**表单/数据结果**（`kingdee_query`/`kingdee_save`）对接数据层。

## Mock 演示

无真实金蝶实例时，打开插件配置的 `mock: true`，`kingdee_*` 用本地固化信封跑通流程（返回形如 `SO-MOCK-1` 的数据），用于演示与测试，不连接真实账套。

## 常见错误

- `IsSuccess=false` 且 `Message` 提示缺少字段/数据 → 补全必填字段，核对 `FormId`、字段名。
- 认证失败 → 检查 `acctId`、用户名密码（`user`）或 `appId`/`appSecret` + 集成用户名（`app`），确认 WebAPI 已启用、账号未锁定。
- **2022-11-29 之后开通、产品版本 V8.1+ 的公有云租户**：金蝶**不再接受账号密码登录**，必须改用 `app`（第三方系统登录授权）模式；并先把调用方出口 IP 加入「第三方系统登录授权」白名单。
- 查询返回**空集**但应有数据 → 先查权限（V9.1 无权限可能表现为空结果），再查 `filter` 与 `FieldKeys`。
- 单据状态不可执行该操作 → 检查 `FDocumentStatus` 与状态机顺序。
- 保存/提交超时后**不要盲目重发** → 先按单据编号回查确认是否已落库（V9.1 幂等要求）。

> 具体字段/校验报错，优先用 `kingdee_query` 在目标账套核对，不要凭常识猜测。
