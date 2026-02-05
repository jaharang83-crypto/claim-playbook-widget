// claim_widget_app_v1.js
// Generated: 2026-02-05
(function(w){
  function el(tag, attrs={}, children=[]){
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => {
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else n.setAttribute(k, v);
    });
    (children||[]).forEach(c => n.appendChild(c));
    return n;
  }
  function toJson(v){ try{ return JSON.stringify(v, null, 2); }catch(e){ return String(v); } }

  async function search(q){
    const query = (q||"").trim();
    const out = { query, hits: [] };
    if (!query) return out;

    const cards = (w.CLAIM_DB?.cards || []);
    const ql = query.toLowerCase();
    const cardHits = cards.filter(c => toJson(c).toLowerCase().includes(ql)).slice(0, 10);
    cardHits.forEach(c => out.hits.push({ type:"card", title:c.title, data:c }));

    return out;
  }

  function injectStyle(){
    if (document.getElementById("cw-style")) return;
    const css = `
      .cw-box{border:1px solid #e5e7eb; border-radius:14px; padding:14px; font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;}
      .cw-title{font-weight:900; font-size:18px;}
      .cw-sub{font-weight:600; font-size:12px; color:#555; margin-left:6px;}
      .cw-row{display:flex; gap:8px; margin-top:10px;}
      .cw-input{flex:1; padding:10px 12px; border:1px solid #d1d5db; border-radius:12px; font-size:14px;}
      .cw-btn{padding:10px 12px; border:1px solid #111; background:#111; color:#fff; border-radius:12px; font-weight:800; cursor:pointer;}
      .cw-msg{margin-top:10px; font-size:13px; color:#333;}
      .cw-pre{margin-top:10px; background:#0f172a; color:#e2e8f0; padding:12px; border-radius:12px; overflow:auto; font-size:12px; line-height:1.5;}
    `;
    const st = document.createElement("style");
    st.id="cw-style";
    st.textContent = css;
    document.head.appendChild(st);
  }

  w.ClaimWidget = w.ClaimWidget || {};
  w.ClaimWidget.mount = function(rootSelector){
    injectStyle();
    const root = document.querySelector(rootSelector);
    root.innerHTML = "";
    const box = el("div", { class:"cw-box" });
    const title = el("div", { class:"cw-title", html:"보험청구 플레이북 위젯 <span class='cw-sub'>(샘플)</span>" });
    const row = el("div", { class:"cw-row" });
    const input = el("input", { class:"cw-input", placeholder:"예: gabapentin / flunitrazepam / D4250 / JX999" });
    const btn = el("button", { class:"cw-btn" }, [document.createTextNode("검색")]);
    const msg = el("div", { class:"cw-msg" });
    const pre = el("pre", { class:"cw-pre" });
    row.appendChild(input); row.appendChild(btn);
    box.appendChild(title); box.appendChild(row); box.appendChild(msg); box.appendChild(pre);
    root.appendChild(box);

    async function run(){
      msg.textContent = "검색 중…";
      const res = await search(input.value);
      msg.textContent = res.hits.length ? `결과: ${res.hits.length}건` : "검색 결과 없음";
      pre.textContent = toJson(res);
    }
    btn.addEventListener("click", run);
    input.addEventListener("keydown", (e) => { if(e.key==="Enter") run(); });
  };
})(window);
