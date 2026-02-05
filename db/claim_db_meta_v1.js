// claim_db_meta_v1.js
// Generated: 2026-02-05
(function(w){
  w.CLAIM_DB = w.CLAIM_DB || {};
  w.CLAIM_DB.meta = {
    schemaVersion: "v1",
    builtAt: "2026-02-05",
    disclaimer: [
      "본 DB는 '심사/준법' 관점에서 근거 기반으로 구성합니다.",
      "자동 추천은 '후보'이며, 최종 확정은 차트 진단/근거와 일치해야 안전합니다.",
      "근거 불충분 항목은 needs_verification으로 남깁니다."
    ]
  };
  w.CLAIM_DB.masters = w.CLAIM_DB.masters || { kcd: {}, drugs: {}, fees: {} };
  w.CLAIM_DB.codeTables = w.CLAIM_DB.codeTables || {};
  w.CLAIM_DB.cards = w.CLAIM_DB.cards || [];
})(window);
