// claim_widget_app_v1.js (CARD UI)
// Updated: 2026-02-05
(function (w) {
  function el(tag, attrs = {}, children = []) {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k === "text") n.textContent = v;
      else n.setAttribute(k, v);
    });
    (children || []).forEach((c) => n.appendChild(c));
    return n;
  }

  function injectStyle() {
    if (document.getElementById("cw-style-v2")) return;
    const css = `
      #claimWidgetRoot .cw-wrap{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial; }
      #claimWidgetRoot .cw-box{border:1px solid #e5e7eb;border-radius:16px;padding:16px;background:#fff;}
      #claimWidgetRoot .cw-head{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;flex-wrap:wrap;}
      #claimWidgetRoot .cw-title{font-weight:900;font-size:18px;line-height:1.2;}
      #claimWidgetRoot .cw-sub{font-weight:700;font-size:12px;color:#6b7280;margin-left:8px;}
      #claimWidgetRoot .cw-row{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;}
      #claimWidgetRoot .cw-input{flex:1;min-width:240px;padding:10px 12px;border:1px solid #d1d5db;border-radius:12px;font-size:14px;}
      #claimWidgetRoot .cw-btn{padding:10px 12px;border:1px solid #111;background:#111;color:#fff;border-radius:12px;font-weight:900;cursor:pointer;}
      #claimWidgetRoot .cw-meta{margin-top:10px;font-size:12px;color:#374151;display:flex;gap:10px;flex-wrap:wrap;}
      #claimWidgetRoot .cw-badge{display:inline-block;padding:3px 8px;border-radius:999px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:800;}
      #claimWidgetRoot .cw-grid{margin-top:12px;display:grid;grid-template-columns:1fr;gap:10px;}
      #claimWidgetRoot .cw-card{border:1px solid #e5e7eb;border-radius:14px;padding:12px;background:#fff;}
      #claimWidgetRoot .cw-card-title{font-weight:900;font-size:15px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
      #claimWidgetRoot .cw-card-type{font-size:11px;font-weight:900;padding:2px 8px;border-radius:999px;background:#111;color:#fff;}
      #claimWidgetRoot .cw-sec{margin-top:10px;padding-top:10px;border-top:1px dashed #e5e7eb;}
      #claimWidgetRoot .cw-h{font-size:12px;font-weight:900;color:#111;margin-bottom:6px;}
      #claimWidgetRoot .cw-list{margin:0;padding-left:18px;font-size:13px;color:#111;line-height:1.55;}
      #claimWidgetRoot .cw-note{font-size:12px;color:#6b7280;line-height:1.5;}
      #claimWidgetRoot .cw-pill{display:inline-flex;align-items:center;gap:6px;border:1px solid #e5e7eb;background:#f9fafb;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:800;}
      #claimWidgetRoot .cw-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;}
      #claimWidgetRoot .cw-copy{padding:8px 10px;border:1px solid #111;background:#fff;color:#111;border-radius:10px;font-weight:900;cursor:pointer;font-size:12px;}
      #claimWidgetRoot .cw-copy:hover{background:#111;color:#fff;}
      #claimWidgetRoot .cw-checks{display:grid;grid-template-columns:1fr;gap:6px;}
      #claimWidgetRoot .cw-check{display:flex;gap:8px;align-items:flex-start;font-size:13px;color:#111;}
      #claimWidgetRoot .cw-err{border:1px solid #fca5a5;background:#fff;padding:12px;border-radius:12px;color:#111;}
    `;
    const st = document.createElement("style");
    st.id = "cw-style-v2";
    st.textContent = css;
    document.head.appendChild(st);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // fallback
      window.prompt("복사하세요 (Ctrl+C)", text);
      return false;
    }
  }

  function stringifySafe(v) {
    try { return JSON.stringify(v).toLowerCase(); } catch { return String(v).toLowerCase(); }
  }

  function searchCards(q) {
    const query = (q || "").trim();
    if (!query) return [];
    const ql = query.toLowerCase();
    const cards = (w.CLAIM_DB && Array.isArray(w.CLAIM_DB.cards)) ? w.CLAIM_DB.cards : [];
    return cards.filter(c => stringifySafe(c).includes(ql)).slice(0, 20);
  }

  function renderCard(card) {
    const typeLabel = card.type || "card";
    const title = card.title || "(제목 없음)";

    const recommend = card.recommend_icd || {};
    const core2 = Array.isArray(recommend.core2) ? recommend.core2 : [];
    const chooseRule = recommend.choose_rule || "";

    const sp = card.specific_detail || {};
    const spRequired = sp.required;
    const spCode = sp.code || "";
    const spDecision = sp.decision || "";
    const spTemplates = Array.isArray(sp.templates) ? sp.templates : [];

    const risks = Array.isArray(card.risk_triggers) ? card.risk_triggers : [];

    const box = el("div", { class: "cw-card" });
    const head = el("div", { class: "cw-card-title" }, [
      el("span", { class: "cw-card-type", text: typeLabel.toUpperCase() }),
      el("span", { text: title }),
    ]);

    // 추천 상병코드 2개
    const sec1 = el("div", { class: "cw-sec" });
    sec1.appendChild(el("div", { class: "cw-h", text: "추천 상병코드(후보) 2개" }));
    if (core2.length) {
      const ul = el("ul", { class: "cw-list" });
      core2.slice(0, 2).forEach(x => {
        ul.appendChild(el("li", { html: `<b>${x.code || ""}</b> — ${x.note || ""}` }));
      });
      sec1.appendChild(ul);
    } else {
      sec1.appendChild(el("div", { class: "cw-note", text: "등록된 후보 상병코드가 없습니다." }));
    }
    if (chooseRule) sec1.appendChild(el("div", { class: "cw-note", text: `선택 규칙: ${chooseRule}` }));

    // 특정내역/특정기호
    const sec2 = el("div", { class: "cw-sec" });
    sec2.appendChild(el("div", { class: "cw-h", text: "특정내역/특정기호(필요 시)" }));
    const pills = el("div", { class: "cw-meta" });

    pills.appendChild(el("span", { class: "cw-pill", html: `<b>필요여부</b>: ${String(spRequired)}` }));
    pills.appendChild(el("span", { class: "cw-pill", html: `<b>코드</b>: ${spCode || "-"}` }));
    sec2.appendChild(pills);

    if (spDecision) sec2.appendChild(el("div", { class: "cw-note", text: spDecision }));

    if (spTemplates.length) {
      const ul = el("ul", { class: "cw-list" });
      spTemplates.forEach(t => ul.appendChild(el("li", { text: t })));
      sec2.appendChild(ul);

      const actions = el("div", { class: "cw-actions" });
      spTemplates.forEach((t, idx) => {
        const b = el("button", { class: "cw-copy", text: `문구 복사 ${idx + 1}` });
        b.addEventListener("click", () => copyText(t));
        actions.appendChild(b);
      });
      sec2.appendChild(actions);
    } else {
      sec2.appendChild(el("div", { class: "cw-note", text: "등록된 템플릿 문구가 없습니다." }));
    }

    // 리스크 체크리스트
    const sec3 = el("div", { class: "cw-sec" });
    sec3.appendChild(el("div", { class: "cw-h", text: "삭감/조정 리스크 체크" }));
    if (risks.length) {
      const wrap = el("div", { class: "cw-checks" });
      risks.forEach(r => {
        const id = "cwchk_" + Math.random().toString(36).slice(2);
        const cb = el("input", { type: "checkbox", id });
        const lb = el("label", { for: id, text: r });
        const row = el("div", { class: "cw-check" }, [cb, lb]);
        wrap.appendChild(row);
      });
      sec3.appendChild(wrap);
    } else {
      sec3.appendChild(el("div", { class: "cw-note", text: "등록된 리스크 항목이 없습니다." }));
    }

    // 근거(현재는 샘플이므로 안내만)
    const sec4 = el("div", { class: "cw-sec" });
    sec4.appendChild(el("div", { class: "cw-h", text: "근거/출처" }));
    sec4.appendChild(el("div", { class: "cw-note", text: "※ 샘플 DB에는 일부가 needs_verification(확인 필요) 상태입니다. 고시/세부사항/심사지침 링크를 연결해 확정하세요." }));

    box.appendChild(head);
    box.appendChild(sec1);
    box.appendChild(sec2);
    box.appendChild(sec3);
    box.appendChild(sec4);
    return box;
  }

  w.ClaimWidget = w.ClaimWidget || {};
  w.ClaimWidget.mount = function (rootSelector) {
    injectStyle();
    const root = document.querySelector(rootSelector);
    if (!root) return;

    root.innerHTML = "";
    root.classList.add("cw-wrap");

    const box = el("div", { class: "cw-box" });
    const head = el("div", { class: "cw-head" }, [
      el("div", { class: "cw-title", html: `보험청구 플레이북 위젯 <span class="cw-sub">(카드형 · 샘플)</span>` }),
      el("div", { class: "cw-note", text: "검색: 성분/검사코드/상병코드/특정내역(JX999 등)" }),
    ]);

    const row = el("div", { class: "cw-row" });
    const input = el("input", { class: "cw-input", placeholder: "예: gabapentin / flunitrazepam / D4250 / JX999" });
    const btn = el("button", { class: "cw-btn", text: "검색" });
    row.appendChild(input);
    row.appendChild(btn);

    const meta = el("div", { class: "cw-meta" });
    const resultInfo = el("span", { class: "cw-badge", text: "결과: 0건" });
    meta.appendChild(resultInfo);

    const grid = el("div", { class: "cw-grid" });

    async function run() {
      const q = input.value;
      const hits = searchCards(q);
      resultInfo.textContent = `결과: ${hits.length}건`;
      grid.innerHTML = "";

      if (!q.trim()) {
        grid.appendChild(el("div", { class: "cw-note", text: "검색어를 입력하세요." }));
        return;
      }
      if (!hits.length) {
        grid.appendChild(el("div", { class: "cw-note", text: "검색 결과가 없습니다." }));
        return;
      }
      hits.forEach(c => grid.appendChild(renderCard(c)));
    }

    btn.addEventListener("click", run);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });

    box.appendChild(head);
    box.appendChild(row);
    box.appendChild(meta);
    box.appendChild(grid);
    root.appendChild(box);
  };
})(window);
