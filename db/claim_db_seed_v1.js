// claim_db_seed_v1.js
// Generated: 2026-02-05
(function(w){
  w.CLAIM_DB = w.CLAIM_DB || {};
  w.CLAIM_DB.cards = w.CLAIM_DB.cards || [];
  w.CLAIM_DB.codeTables = w.CLAIM_DB.codeTables || {};

  w.CLAIM_DB.codeTables.departmentCodes = w.CLAIM_DB.codeTables.departmentCodes || [
    { dept: "내과", code: "01" },
    { dept: "정형외과", code: "08" },
    { dept: "이비인후과", code: "12" }
  ];

  w.CLAIM_DB.codeTables.specificDetailFreeText = w.CLAIM_DB.codeTables.specificDetailFreeText || [
    { code: "MX999", unit: "명일련", desc: "기타내역(자유기재)" },
    { code: "JX999", unit: "명일련", desc: "기타내역(자유기재)" }
  ];

  const cards = [
    {
      key: "ingredient_gabapentin",
      type: "ingredient",
      title: "가바펜틴 (gabapentin) 원페이저(샘플)",
      recommend_icd: {
        core2: [
          { code: "G53.0", note: "대상포진 후 신경통(PHN) 목적 후보" },
          { code: "G47.0", note: "※ 예시(실제 적합성은 차트/근거 확인 필요)" }
        ],
        choose_rule: "치료 목적을 먼저 확정 후, 차트 진단과 일치하는 상병코드 선택"
      },
      specific_detail: {
        required: false,
        code: null,
        decision: "특정내역 의무 여부는 근거 연결 후 확정",
        templates: []
      },
      risk_triggers: [
        "상병-목적 불일치",
        "병용/장기처방 근거 누락"
      ]
    },
    {
      key: "ingredient_flunitrazepam",
      type: "ingredient",
      title: "플루니트라제팜 (flunitrazepam) 원페이저(샘플)",
      recommend_icd: {
        core2: [
          { code: "G47.0", note: "불면 후보" },
          { code: "F51.0", note: "비기질성 불면 후보" }
        ],
        choose_rule: "불면이 1차 목적이면 G47.0/F51.0 중 차트와 일치하는 코드 선택"
      },
      specific_detail: {
        required: "conditional",
        code: "JT014",
        decision: "처방일수/예외 사유 등 조건에 따라 특정내역 필요할 수 있음(근거 확인 필요)",
        templates: ["JT014: 장기처방 예외 사유(기간/사유) 구체 기재"]
      },
      risk_triggers: ["장기처방 사유 누락", "상병 불일치"]
    },
    {
      key: "test_thyroglobulin_tgab",
      type: "test",
      title: "갑상선 Tg(D4250) + TgAb(D3240) 원페이저(샘플)",
      recommend_icd: {
        core2: [
          { code: "C73", note: "갑상선 악성신생물(예시)" },
          { code: "C77.x", note: "전이 림프절(예시)" }
        ],
        choose_rule: "재발/전이 추적 목적이 명확할 때 차트와 일치하는 코드 선택"
      },
      specific_detail: {
        required: "conditional",
        code: "JX999",
        decision: "설명 필요 상황(추적/동시 시행 사유 등)에 자유기재 활용(근거 확인 필요)",
        templates: ["JX999: 갑상선암 추적관찰(재발/전이 평가) 목적. 동시 시행 사유: (구체 소견)"]
      },
      risk_triggers: ["screening 형태로 보이는 경우", "사유 기록 누락"]
    }
  ];

  const existing = new Set((w.CLAIM_DB.cards || []).map(x => x.key));
  cards.forEach(c => { if(!existing.has(c.key)) w.CLAIM_DB.cards.push(c); });
})(window);
