"use client";

import { useMemo, useState } from "react";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const careers = [
  {
    name: "글로벌경영",
    role: "조달국 다변화와 환율·해상운임 위험을 관리하는 공급망 전략가",
    question: "호주 가뭄이 발생했을 때 어느 국가와 어떤 계약을 추가할 것인가?",
    output: "수입국 포트폴리오와 환율 헤지 전략",
  },
  {
    name: "경영학",
    role: "국산 밀의 원가·재고·브랜드 가치를 함께 설계하는 식품기업 기획자",
    question: "비싼 국산 밀을 소비자가 선택하도록 어떤 상품과 가격을 설계할까?",
    output: "계약재배 기반 국산 밀 제품 사업모델",
  },
  {
    name: "식품자원경제학",
    role: "자급률·농가소득·정책비용을 계량적으로 비교하는 농업경제 분석가",
    question: "직불금 1원은 자급률과 농가소득을 얼마나 높이는가?",
    output: "전략작물직불제 비용–편익 평가",
  },
  {
    name: "농경제사회학",
    role: "고령화·지역공동체·정책 형평성을 살피는 농촌사회 연구자",
    question: "생산 확대의 이익과 부담은 농가·지역·소비자에게 공정한가?",
    output: "지역별 참여 격차와 지속가능성 조사",
  },
];

const shocks = {
  drought: { label: "호주 가뭄", price: 18, supply: 22, climate: 12, note: "주요 조달국 생산 감소 → 국제가격·대체 조달 경쟁 상승" },
  fx: { label: "원/달러 환율 상승", price: 24, supply: 9, climate: 2, note: "같은 달러 가격이어도 원화 수입단가가 즉시 상승" },
  shipping: { label: "해상운송 차질", price: 17, supply: 25, climate: 6, note: "항로 우회·운임 상승 → 도착 지연과 재고 압박" },
  typhoon: { label: "국내 태풍", price: 9, supply: 13, climate: 20, note: "쌀 생산 기반 피해 → 국내 수급 안정성 약화" },
} as const;

type ShockKey = keyof typeof shocks;

export default function Home() {
  const [career, setCareer] = useState(0);
  const [shock, setShock] = useState<ShockKey>("drought");
  const [budget, setBudget] = useState({ direct: 20, reserve: 20, diversity: 20, smart: 20, demand: 20 });
  const total = Object.values(budget).reduce((a, b) => a + b, 0);
  const scores = useMemo(() => {
    const s = shocks[shock];
    return {
      price: clamp(55 + budget.reserve * .55 + budget.diversity * .45 - s.price),
      supply: clamp(47 + budget.reserve * .45 + budget.diversity * .7 + budget.direct * .25 - s.supply),
      farm: clamp(38 + budget.direct * .85 + budget.smart * .35 + budget.demand * .25),
      climate: clamp(42 + budget.smart * .65 + budget.demand * .25 - s.climate),
    };
  }, [budget, shock]);

  const updateBudget = (key: keyof typeof budget, value: number) =>
    setBudget((prev) => ({ ...prev, [key]: value }));

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top"><span>FS</span> 식량안보 전략 연구소</a>
        <div className="navlinks"><a href="#evidence">근거</a><a href="#day3">3일차</a><a href="#lab">시뮬레이터</a><a href="#career">진로</a></div>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow">기후변화와 지속 가능한 진로 × 경제·경영</div>
        <h1>밀 2%의 경고,<br/><em>쌀 99.1%의 기반</em></h1>
        <p className="lead">우리 식량은 어디에서 오고, 국제 충격은 식탁까지 얼마나 걸릴까? 쌀과 밀의 대조를 통해 기후위기 시대의 공급망과 지속 가능한 진로를 탐구합니다.</p>
        <div className="actions"><a className="primary" href="#day3">3일차 탐구 시작</a><a className="secondary" href="#lab">정책 실험하기 →</a></div>
        <div className="hero-note">핵심 질문 · 쌀의 자급 기반을 지키면서 밀의 수입 의존도를 경제적·환경적으로 지속 가능한 방식으로 낮출 수 있을까?</div>
      </section>

      <section className="section" id="evidence">
        <div className="section-head"><span>01 / 근거 확인</span><h2>같은 곡물, 정반대의 생산 기반</h2><p>연도와 지표 정의가 섞이지 않도록 2023 양곡연도 기준을 중심으로 비교했습니다.</p></div>
        <div className="kpis">
          <article><small>쌀 식량자급률</small><strong>99.1%</strong><div className="meter"><i style={{width:"99.1%"}}/></div><p>생산 376.4만t · 식량용 수요 379.9만t</p></article>
          <article className="wheat"><small>밀 식량자급률</small><strong>2.0%</strong><div className="meter"><i style={{width:"2%"}}/></div><p>생산 5.2만t · 식량용 수요 254.1만t</p></article>
          <article><small>전체 식량자급률</small><strong>49.3%</strong><div className="meter"><i style={{width:"49.3%"}}/></div><p>사료용을 제외한 식량 소비 기준</p></article>
        </div>
        <div className="context-grid">
          <div><b>농가인구</b><strong>208.9만 명</strong><span>2023년</span></div>
          <div><b>경지면적</b><strong>151.2만 ha</strong><span>2023년 · 1,512,145ha</span></div>
          <div><b>밀 수입 집중</b><strong>78.0%</strong><span>호주 51.8% + 미국 26.2%</span></div>
        </div>
        <p className="caveat">주의: 수입량은 사료·가공용 포함 여부에 따라 달라집니다. 따라서 ‘전체 수입량’과 ‘식량자급률’을 같은 수급식으로 직접 나누지 않았습니다.</p>
      </section>

      <section className="dark section" id="day3">
        <div className="section-head"><span>02 / 3일차 심화 탐구</span><h2>우리 식량은 어디에서 오는가?</h2><p>자료 읽기에서 끝내지 않고, 국제 충격이 국내 가격과 소비에 전달되는 경로까지 추적합니다.</p></div>
        <div className="origin">
          <div className="rice-card"><span>RICE · 국내 기반</span><h3>쌀</h3><strong>국내 생산 376.4만t</strong><p>높은 자급률은 강점이지만, 태풍·폭염·농가 고령화와 경지 감소가 생산 기반을 흔들 수 있습니다.</p></div>
          <div className="wheat-card"><span>WHEAT · 글로벌 공급망</span><h3>밀</h3><div className="stack"><i style={{width:"51.8%"}}>호주 51.8</i><i style={{width:"26.2%"}}>미국 26.2</i><i style={{width:"10.1%"}}>EU 10.1</i><i>기타</i></div><p>2023년 관세청 수입 중량 기준. 두 국가 집중도 78%는 특정 지역 충격에 민감한 구조를 뜻합니다.</p></div>
        </div>
        <div className="missions">
          {[
            ["① 데이터 판독","쌀·밀 생산량, 식량용 수요, 자급률의 정의와 연도를 표로 정리한다."],
            ["② 공급망 지도","밀 수입국 비중을 계산하고 상위 2개국 집중도(78%)의 위험을 해석한다."],
            ["③ 충격 선택","가뭄·전쟁/항만 차질·환율 상승 중 하나를 골라 원인과 1차 영향을 조사한다."],
            ["④ 시간 경로","선물·환율 → 수입단가 → 제분·식품기업 → 소비자가격의 시차를 설명한다."],
            ["⑤ 정책 비교","직불제·비축·수입 다변화·스마트농업을 비용, 효과, 형평성으로 평가한다."],
            ["⑥ 진로 결론","내 전공 관점에서 실행 주체, KPI, 예상 부작용을 포함한 전략을 제안한다."],
          ].map(([h,p])=><article key={h}><b>{h}</b><p>{p}</p></article>)}
        </div>
      </section>

      <section className="section timeline-section">
        <div className="section-head"><span>03 / 충격의 전달 시간</span><h2>해외의 가뭄이 오늘 바로 빵값이 되지는 않는다</h2></div>
        <div className="timeline">
          <article><b>즉시–수주</b><span>국제 선물가격·환율·해상운임 반응</span></article>
          <article><b>1–3개월</b><span>수입 계약·도착 물량·제분 원가에 반영</span></article>
          <article><b>3–6개월</b><span>식품기업 가격·용량·판촉 조정 후 소비자 체감</span></article>
          <article><b>6–12개월+</b><span>조달국 변경·다음 작기 생산·정책 효과 발생</span></article>
        </div>
        <p className="caveat">위 기간은 계약·재고·기업 가격정책에 따라 달라지는 교육용 범위이며 특정 품목 가격의 예측값이 아닙니다.</p>
      </section>

      <section className="story section" id="story">
        <div className="section-head"><span>04 / 게임을 만든 경로</span><h2>자료가 ‘선택의 서사’가 되는 과정</h2><p>숫자를 외우는 과제가 아니라, 실제 정책 담당자가 겪는 제한된 예산과 상충관계를 체험하도록 설계했습니다.</p></div>
        <div className="story-route">
          {[
            ["발견","쌀 99.1%와 밀 2.0%의 격차를 보고 “왜 같은 곡물인데 다른가?”라는 질문을 만든다."],
            ["검증","KASS·통계청·관세청 자료의 연도, 단위, 식량용·사료용 범위를 구분한다."],
            ["위기","호주 가뭄, 환율 상승, 운송 차질, 국내 태풍 중 한 사건이 공급망을 흔든다."],
            ["선택","100포인트 안에서 직불제·비축·다변화·기술·수요 정책의 우선순위를 정한다."],
            ["성찰","점수보다 중요한 상충관계를 해석하고 내 전공의 언어로 개선안을 제안한다."],
          ].map(([title,text],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><b>{title}</b><p>{text}</p></article>)}
        </div>
        <div className="game-structure">
          <div><small>플레이어</small><b>2035 식량안보 전략팀</b><p>글로벌 조달·기업기획·농업경제·농촌사회 중 하나의 역할을 맡습니다.</p></div>
          <div><small>갈등</small><b>모든 지표를 동시에 높일 수 없다</b><p>가격 안정, 공급 회복력, 농가소득, 환경 지속성 사이에서 우선순위를 선택합니다.</p></div>
          <div><small>승리 조건</small><b>정답 대신 근거 있는 전략</b><p>100포인트를 맞추고 결과의 장점·부작용·보완책을 자료로 설명하면 탐구가 완성됩니다.</p></div>
        </div>
        <div className="narrative"><span>GAME BRIEF</span><p>“2035년, 주요 밀 수입국에 기록적 가뭄이 발생했다. 국제 밀 가격과 원/달러 환율이 동시에 오르는 가운데, 정부는 추가 식량안보 예산 100포인트를 편성했다. 당신의 팀은 국내 생산 기반과 소비자 가격, 농가소득, 탄소 부담을 함께 고려한 포트폴리오를 제출해야 한다.”</p></div>
      </section>

      <section className="lab" id="lab">
        <div className="section-head"><span>05 / 정책 예산 게임</span><h2>당신이 식량안보 전략가라면?</h2><p>정책 포인트 100을 배분하고 국제 충격에 견디는 조합을 찾아보세요.</p></div>
        <div className="lab-grid">
          <div className="controls">
            <label>충격 시나리오<select value={shock} onChange={(e)=>setShock(e.target.value as ShockKey)}>{Object.entries(shocks).map(([k,v])=><option value={k} key={k}>{v.label}</option>)}</select></label>
            {([
              ["direct","전략작물직불제"],["reserve","공공 비축"],["diversity","수입국 다변화"],["smart","기후 스마트농업"],["demand","국산 밀 수요 창출"]
            ] as const).map(([key,label])=><label className="slider" key={key}><span>{label}<b>{budget[key]}</b></span><input type="range" min="0" max="40" value={budget[key]} onChange={(e)=>updateBudget(key,+e.target.value)}/></label>)}
            <div className={total === 100 ? "total ok" : "total"}>배분 합계 <strong>{total}</strong>/100 <span>{total===100?"✓ 완료":"100에 맞춰주세요"}</span></div>
          </div>
          <div className="results">
            <div className="shock-note"><b>{shocks[shock].label}</b><span>{shocks[shock].note}</span></div>
            {Object.entries({price:"가격 안정성",supply:"공급 회복력",farm:"농가소득",climate:"환경 지속성"}).map(([k,label])=><div className="score" key={k}><span>{label}</span><div><i style={{width:`${scores[k as keyof typeof scores]}%`}}/></div><b>{scores[k as keyof typeof scores]}</b></div>)}
            <p className="interpretation">{scores.supply >= 65 ? "공급 회복력은 양호합니다." : "공급 충격을 버틸 비축·조달 다변화가 더 필요합니다."} {scores.farm > scores.price + 15 ? "농가 지원에 비해 소비자 가격 안정 대책이 부족할 수 있습니다." : "생산자와 소비자 지표의 균형을 점검했습니다."}</p>
            <small>점수는 정책 간 상충관계를 학습하기 위한 상대지수이며 실제 정책 효과 예측이 아닙니다.</small>
          </div>
        </div>
      </section>

      <section className="section policy">
        <div className="section-head"><span>06 / 실제 정책 읽기</span><h2>전략작물직불제는 무엇인가?</h2></div>
        <div className="policy-grid">
          <article><b>목적</b><p>논에 쌀 대신 밀·콩·가루쌀 등 전략작물을 재배하도록 지원해 식량자급률, 쌀 수급 안정, 농가소득을 함께 높이는 제도입니다.</p></article>
          <article><b>2026 예시</b><p>겨울 밀 100만원/ha + 여름 콩·가루쌀 200만원/ha + 이모작 인센티브 100만원/ha = 최대 400만원/ha 예시.</p></article>
          <article><b>경제적 한계</b><p>생산만 늘리면 재고와 재정부담이 생길 수 있습니다. 계약재배, 품질 표준, 저장·가공시설, 소비시장 확대가 함께 필요합니다.</p></article>
        </div>
      </section>

      <section className="career" id="career">
        <div className="section-head"><span>07 / 지속 가능한 진로</span><h2>같은 문제를 네 전공의 언어로</h2><p>기후위기를 ‘환경 문제’에만 머물지 않고 공급망·기업·정책·사회 선택의 문제로 확장합니다.</p></div>
        <div className="career-tabs">{careers.map((c,i)=><button className={career===i?"active":""} onClick={()=>setCareer(i)} key={c.name}>{c.name}</button>)}</div>
        <div className="career-card">
          <span>나의 역할</span><h3>{careers[career].role}</h3>
          <div><b>탐구 질문</b><p>{careers[career].question}</p></div>
          <div><b>후속 산출물</b><p>{careers[career].output}</p></div>
        </div>
        <div className="record">
          <b>생기부 연결 문장 예시</b>
          <p>“쌀과 밀의 2023년 식량자급률 및 밀 수입국 집중도를 비교하고, 기후 충격이 환율·운임·기업 원가를 거쳐 소비자가격에 전달되는 시차를 분석함. 정책 예산 시뮬레이션을 설계하여 자급률 확대와 재정부담, 농가소득과 소비자 후생 간 상충관계를 탐구하고, 지속 가능한 글로벌 공급망 전략을 제안함.”</p>
          <small>그대로 복사하기보다 본인이 선택한 시나리오·수치·결론을 넣어 개인화하세요.</small>
        </div>
      </section>

      <footer>
        <div><b>근거 자료</b><p>농림축산식품부 「2025 농림축산식품 주요통계」(2023 양곡연도 자급률·수급), 통계청 「2023 농림어업조사」 및 경지면적조사, 관세청 수출입무역통계(2023 밀 HS 1001), 농림축산식품부 2026 전략작물직불제 사업시행지침.</p></div>
        <div className="source-links">
          <a href="https://kass.mafra.go.kr/statHtml/statHtml.do?mode=tab&orgId=114&tblId=DT_114_015_F033" target="_blank" rel="noreferrer">KASS 자급률 원표 ↗</a>
          <a href="https://sri.kostat.go.kr/board.es?act=view&bid=226&list_no=430470&mid=a10301080100" target="_blank" rel="noreferrer">2023 농림어업조사 ↗</a>
          <a href="https://unipass.customs.go.kr/ets/" target="_blank" rel="noreferrer">관세청 무역통계 ↗</a>
          <a href="https://www.mafra.go.kr/bbs/home/791/595036/download.do" target="_blank" rel="noreferrer">2026 전략작물직불 공고 ↗</a>
        </div>
        <small>교육용 탐구 사이트 · 서로 다른 통계의 기준 연도와 집계 범위를 반드시 확인하세요.</small>
      </footer>
    </main>
  );
}
