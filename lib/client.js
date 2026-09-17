window.__ModuleLoader__.load({
	id: "dsh-kingdee",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		//#region src/client/settings-card.ts
		/**
		* dsh-kingdee Client-side settings card (browser half).
		*
		* Built by `tsdown.config.ts` into `lib/client.js` — the lazy-CJS factory the
		* client module system loads (`dsh.client` manifest in package.json). The Host
		* half that registers the `kingdee` settings namespace is `src/index.ts`; this
		* card keys on the same namespace so the settings page pairs the two halves.
		*
		* Per the DSH settings-card contract (docs/cookbook/adding-a-settings-card):
		*  - the card registers into the `settings.plugin.item` slot under `kingdee`;
		*  - reads/writes through `ctx.settingsScope` (revision-fenced writes);
		*  - the secret references (appSecretRef / userNameRef / passwordRef) are
		*    plain section fields holding reference NAMES, not secrets, so they ride
		*    the section like every other connection fact;
		*  - bundle-purity gate: no cross-plugin VALUE imports — the card renders its
		*    own chrome (type-only imports are erased before the gate runs).
		*/
		const inject = [
			"slots",
			"locale",
			"connection",
			"remote",
			"settingsScope"
		];
		/** One connection fact the card renders as a text field. */
		const TEXT_FIELDS = [
			{
				field: "baseUrl",
				label: "Base URL"
			},
			{
				field: "acctId",
				label: "Account ID (acctId)"
			},
			{
				field: "authMode",
				label: "Auth mode (user | app)"
			},
			{
				field: "appId",
				label: "App ID (app mode)"
			},
			{
				field: "appSecretRef",
				label: "App secret reference (env name)"
			},
			{
				field: "userNameRef",
				label: "User name / 集成用户 reference (env name)"
			},
			{
				field: "passwordRef",
				label: "Password reference (env name)"
			},
			{
				field: "lcid",
				label: "Locale id (lcid)"
			},
			{
				field: "organization",
				label: "Organization (FNumber)"
			},
			{
				field: "timeoutMs",
				label: "Timeout (ms)"
			}
		];
		/** Format one section value as draft text. */
		function formatValue(value) {
			return value === void 0 || value === null ? "" : String(value);
		}
		/** Escape one value for safe interpolation into the card's HTML. */
		function escapeHtml(text) {
			return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
		}
		/**
		* Render the card body. Self-contained HTML (no shared chrome imports): the
		* bundle-purity gate forbids value imports of another plugin's card chrome.
		*/
		function renderCard(state) {
			if (!state.available) return "<div data-card=\"kingdee\"><p>Kingdee settings are unavailable on this connection.</p></div>";
			return `<div data-card="kingdee">${state.fields.map(({ field, label, text }) => `
    <label data-field="${field}" style="display:block;margin:8px 0">
      <span style="display:block;font-weight:600">${escapeHtml(label)}</span>
      <input data-bind="${field}" value="${escapeHtml(text)}" ${state.writable ? "" : "disabled"}
        style="width:100%;box-sizing:border-box" />
    </label>`).join("")}${state.stagedCount > 0 ? `<p data-note="staged">${state.stagedCount} unsaved edit(s)</p>` : ""}</div>`;
		}
		function apply(ctx) {
			const scope = ctx.settingsScope.bind({ namespace: "kingdee" });
			const drafts = /* @__PURE__ */ new Map();
			const root = document.createElement("div");
			root.dataset.pluginCard = "kingdee";
			const currentFields = () => {
				const value = scope.getSnapshot().value ?? {};
				return TEXT_FIELDS.map(({ field, label }) => ({
					field,
					label,
					text: drafts.get(field) ?? formatValue(value[field])
				}));
			};
			const repaint = () => {
				const snapshot = scope.getSnapshot();
				root.innerHTML = renderCard({
					available: snapshot.status === "ready",
					writable: snapshot.writable,
					fields: currentFields(),
					stagedCount: drafts.size
				});
				for (const input of root.querySelectorAll("input[data-bind]")) input.addEventListener("change", () => {
					const field = input.dataset.bind ?? "";
					if (input.value === "") drafts.delete(field);
					else drafts.set(field, input.value);
					repaint();
				});
			};
			const save = async () => {
				for (const [field, text] of drafts) await scope.set(field, text);
				drafts.clear();
				repaint();
			};
			const saveBar = document.createElement("div");
			const saveButton = document.createElement("button");
			saveButton.type = "button";
			saveButton.textContent = "Save";
			saveButton.addEventListener("click", () => {
				save();
			});
			saveBar.appendChild(saveButton);
			ctx.effect(() => scope.subscribe(repaint), "kingdee-card: scope mirror");
			repaint();
			ctx.effect(() => ctx.locale.register("settings.kingdee", {
				en: {
					kingdeeTitle: "Kingdee Cloud Starry Sky",
					kingdeeDescription: "Kingdee Cloud Starry Sky WebAPI connection and credential references"
				},
				zh: {
					kingdeeTitle: "金蝶云·星空",
					kingdeeDescription: "金蝶云·星空 WebAPI 连接参数与凭据引用配置"
				}
			}), "kingdee-card: dictionaries");
			const cardComponent = (props) => {
				if (props.view === "summary") return props.t ? props.t("kingdeeDescription") : "Kingdee Cloud Starry Sky WebAPI connection and credential references";
				return react.default.createElement("div", { ref: (el) => {
					if (el && !el.contains(root)) el.replaceChildren(root, saveBar);
				} });
			};
			ctx.slots.inject("plugins.row.config", () => ctx.slots.register({
				name: "plugins.row.config",
				key: "dsh-kingdee#kingdee",
				locale: "settings.kingdee"
			}, cardComponent));
			ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
				name: "plugins.bundle.config",
				key: "dsh-kingdee",
				locale: "settings.kingdee"
			}, cardComponent));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map