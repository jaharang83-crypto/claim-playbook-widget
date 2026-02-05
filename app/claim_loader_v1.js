// claim_loader_v1.js
// Generated: 2026-02-05
(function(w){
  const CFG = w.CLAIM_WIDGET_CONFIG || {};
  const baseUrl = (CFG.baseUrl || "").replace(/\/$/, "");
  const indexUrl = CFG.indexUrl || (baseUrl ? (baseUrl + "/db/claim_db_parts_index_v1.json") : "");
  const core = CFG.core || [
    (baseUrl + "/db/claim_db_meta_v1.js"),
    (baseUrl + "/db/claim_db_seed_v1.js")
  ];

  function injectScript(src){
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = () => resolve(src);
      s.onerror = () => reject(new Error("Failed to load: " + src));
      document.head.appendChild(s);
    });
  }

  async function loadCore(){
    if (!baseUrl) throw new Error("CLAIM_WIDGET_CONFIG.baseUrl is missing.");
    for (const src of core) { await injectScript(src); }
  }

  async function fetchIndex(){
    const res = await fetch(indexUrl, { cache: "no-store" });
    if(!res.ok) throw new Error("Failed to fetch parts index: " + res.status);
    return await res.json();
  }

  w.ClaimDB = w.ClaimDB || {};
  w.ClaimDB._index = null;

  w.ClaimDB.init = async function(){
    await loadCore();
    if (!w.CLAIM_DB) throw new Error("CLAIM_DB not found after core load.");
    return true;
  };

  w.ClaimDB.getIndex = async function(){
    if (w.ClaimDB._index) return w.ClaimDB._index;
    w.ClaimDB._index = await fetchIndex();
    return w.ClaimDB._index;
  };

  w.ClaimDB.lookupKcd = function(code){ return (w.CLAIM_DB?.masters?.kcd || {})[code] || null; };
  w.ClaimDB.lookupDrug = function(ingredient){ return (w.CLAIM_DB?.masters?.drugs || {})[(ingredient||"").toLowerCase()] || null; };
  w.ClaimDB.lookupFee = function(code){ return (w.CLAIM_DB?.masters?.fees || {})[code] || null; };
})(window);
