"use client";

import { useMemo, useState } from "react";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const careers = [
  {
    name: "글로벌경영",
    role: "조달국 다변화와 환율·해상운임 위험을 관리하는 공급망 전략가",
    question: "호주 가뭄이 발생했을 때 어느 국가와 어떤 계약을 추가할 것인가?",
    output: "수입국 포트폴리오와 환율 헤지 전략",
    tool: "공급망 지도 · HHI · 환율 시나리오",
    project: "호주 의존도 51.8%를 낮추는 3개국 조달 포트폴리오 설계",
    keyword: "글로벌 공급망 · 무역 · 리스크 관리",
  },
  {
    name: "경영학",
    role: "국산 밀의 원가·재고·브랜드 가치를 함께 설계하는 식품기업 기획자",
    question: "비싼 국산 밀을 소비자가 선택하도록 어떤 상품과 가격을 설계할까?",
    output: "계약재배 기반 국산 밀 제품 사업모델",
    tool: "원가구조 · 재고회전 · 가격탄력성",
    project: "국산 밀 계약재배 제품의 손익분기점과 브랜드 전략 비교",
    keyword: "기업전략 · 마케팅 · ESG 경영",
  },
  {
    name: "식품자원경제학",
    role: "자급률·농가소득·정책비용을 계량적으로 비교하는 농업경제 분석가",
    question: "직불금 1원은 자급률과 농가소득을 얼마나 높이는가?",
    output: "전략작물직불제 비용–편익 평가",
    tool: "자급률 · 사회적 편익 · 비용–편익 분석",
    project: "전략작물직불금의 자급 기반·농가소득 효과를 평가하는 지표 설계",
    keyword: "농업경제 · 정책평가 · 자원배분",
  },
  {
    name: "농경제사회학",
    role: "고령화·지역공동체·정책 형평성을 살피는 농촌사회 연구자",
    question: "생산 확대의 이익과 부담은 농가·지역·소비자에게 공정한가?",
    output: "지역별 참여 격차와 지속가능성 조사",
    tool: "이해관계자 지도 · 정책 형평성 · 지역조사",
    project: "고령농·청년농의 정책 참여 격차와 농촌공동체 영향 인터뷰",
    keyword: "농촌사회 · 지역개발 · 정책 형평성",
  },
];

type Metrics = { price: number; supply: number; farm: number; climate: number };

const crisisCards: Array<{id:string; tag:string; label:string; note:string; impact:Metrics}> = [
  { id:"drought", tag:"기후·생산", label:"호주 2년 연속 가뭄", note:"주요 밀 산지의 수확량 감소로 국제가격과 대체 조달 경쟁이 동시에 상승합니다.", impact:{price:-20,supply:-24,farm:-3,climate:-8} },
  { id:"fx", tag:"금융·무역", label:"원/달러 환율 15% 상승", note:"달러 표시 가격이 같아도 원화 수입단가와 식품기업의 원가 부담이 커집니다.", impact:{price:-25,supply:-8,farm:-2,climate:0} },
  { id:"shipping", tag:"물류·지정학", label:"핵심 해상항로 6주 차질", note:"운임 상승과 도착 지연이 재고를 압박하고 긴급 대체 조달 비용을 높입니다.", impact:{price:-17,supply:-27,farm:-2,climate:-5} },
  { id:"typhoon", tag:"기후·국내기반", label:"국내 벼 주산지 태풍", note:"쌀 생산 기반이 손상되어 높은 자급률만으로는 설명되지 않는 국내 기후위험이 드러납니다.", impact:{price:-10,supply:-18,farm:-14,climate:-12} },
];

const policyCards: Array<{id:string; type:string; title:string; cost:number; detail:string; downside:string; effects:Metrics; hhi:number}> = [
  {id:"reserve",type:"단기 안정",title:"공공비축 방출",cost:3,detail:"재고를 조기에 방출해 도착 지연과 가격 급등을 완충합니다.",downside:"보관비와 재고 노후화 부담",effects:{price:16,supply:13,farm:-3,climate:-3},hhi:0},
  {id:"diversify",type:"글로벌 조달",title:"수입국 다변화",cost:3,detail:"공급계약을 여러 기후권으로 분산해 동시 실패 확률을 낮춥니다.",downside:"단기 계약단가·품질관리 비용 상승",effects:{price:7,supply:19,farm:0,climate:1},hhi:-700},
  {id:"hedge",type:"금융 전략",title:"환율 헤지",cost:2,detail:"선물환 계약으로 원화 수입원가의 변동폭을 제한합니다.",downside:"환율 하락 시 헤지 비용 발생",effects:{price:17,supply:2,farm:0,climate:0},hhi:0},
  {id:"contract",type:"국내 기반",title:"국산 밀 계약재배",cost:3,detail:"기업과 농가의 사전계약으로 판로와 생산량을 함께 안정시킵니다.",downside:"단기 소비자가격·재정 부담",effects:{price:-4,supply:13,farm:21,climate:5},hhi:-120},
  {id:"smart",type:"기후 적응",title:"기후스마트 재배",cost:3,detail:"내재해 품종·정밀관수·생육예측으로 기후변동에 대한 생산 회복력을 높입니다.",downside:"초기 투자와 데이터 격차",effects:{price:1,supply:11,farm:8,climate:20},hhi:0},
  {id:"insurance",type:"지역 회복",title:"기후보험·공동영농",cost:2,detail:"재해손실을 분산하고 공동기계화로 고령농의 생산 지속성을 보완합니다.",downside:"보험료와 도덕적 해이 관리",effects:{price:0,supply:5,farm:18,climate:9},hhi:0},
];

const gameRoles = [
  {name:"글로벌 공급망 책임자",major:"글로벌경영",mission:"공급 회복력 70 이상 + HHI 3,000 미만",check:(m:Metrics,hhi:number)=>m.supply>=70&&hhi<3000,follow:"기후권이 다른 국가를 묶은 밀 조달 포트폴리오와 환율 헤지안을 작성한다."},
  {name:"식품기업 전략기획자",major:"경영학",mission:"가격 안정성 65 이상 + 계약재배 카드 포함",check:(m:Metrics,_hhi:number,ids:string[])=>m.price>=65&&ids.includes("contract"),follow:"국산 밀 제품의 원가·판매가격·브랜드 프리미엄을 비교한 사업모델을 만든다."},
  {name:"농업경제 정책분석가",major:"식품자원경제학",mission:"네 KPI 모두 58 이상 + 대응비용 7 이하",check:(m:Metrics,_hhi:number,_ids:string[],cost:number)=>Object.values(m).every(v=>v>=58)&&cost<=7,follow:"선택 정책의 비용 1단위당 KPI 개선폭을 계산해 비용–효과성을 평가한다."},
  {name:"농촌 전환 설계자",major:"농경제사회학",mission:"농가소득 70 이상 + 환경 지속성 65 이상",check:(m:Metrics)=>m.farm>=70&&m.climate>=65,follow:"고령농·청년농·소비자에게 정책 편익과 부담이 어떻게 배분되는지 조사한다."},
];

export default function Home() {
  const [career, setCareer] = useState(0);
  const [gameStep, setGameStep] = useState(0);
  const [gameRole, setGameRole] = useState(0);
  const [crisis, setCrisis] = useState<(typeof crisisCards)[number] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [resolved, setResolved] = useState(false);
  const [copied, setCopied] = useState(false);
  const selectedCards = policyCards.filter(card => selected.includes(card.id));
  const usedCapacity = selectedCards.reduce((sum, card) => sum + card.cost, 0);
  const synergy = selected.includes("reserve") && selected.includes("diversify")
    ? {name:"시간 벌기",effects:{price:7,supply:8,farm:0,climate:-1}}
    : selected.includes("diversify") && selected.includes("hedge")
    ? {name:"글로벌 리스크 헤지",effects:{price:8,supply:5,farm:0,climate:0}}
    : selected.includes("contract") && selected.includes("smart")
      ? {name:"국내 전환 투자",effects:{price:0,supply:8,farm:10,climate:7}}
      : selected.includes("smart") && selected.includes("insurance")
        ? {name:"공정한 기후 적응",effects:{price:0,supply:5,farm:8,climate:9}}
        : null;
  const scores = useMemo<Metrics>(() => {
    const base: Metrics = {price:62,supply:58,farm:54,climate:55};
    const impact = crisis?.impact ?? {price:0,supply:0,farm:0,climate:0};
    const policy = selectedCards.reduce<Metrics>((acc,card)=>({
      price:acc.price+card.effects.price,
      supply:acc.supply+card.effects.supply,
      farm:acc.farm+card.effects.farm,
      climate:acc.climate+card.effects.climate,
    }),{price:0,supply:0,farm:0,climate:0});
    const bonus = synergy?.effects ?? {price:0,supply:0,farm:0,climate:0};
    return {
      price:clamp(base.price+impact.price+policy.price+bonus.price),
      supply:clamp(base.supply+impact.supply+policy.supply+bonus.supply),
      farm:clamp(base.farm+impact.farm+policy.farm+bonus.farm),
      climate:clamp(base.climate+impact.climate+policy.climate+bonus.climate),
    };
  }, [crisis, selected, synergy?.name]);
  const hhi = Math.max(0, 3555 + selectedCards.reduce((sum,card)=>sum+card.hhi,0));
  const missionPassed = resolved && gameRoles[gameRole].check(scores,hhi,selected,usedCapacity);
  const reportText = crisis ? `${gameRoles[gameRole].major} 관점에서 ${crisis.label}에 대응하였다. ${selectedCards.map(c=>c.title).join(", ")}을 선택해 가격 안정성 ${scores.price}, 공급 회복력 ${scores.supply}, 농가소득 ${scores.farm}, 환경 지속성 ${scores.climate}를 비교하고, 수입집중도 HHI ${hhi}와 ${synergy ? `${synergy.name} 시너지` : "정책 간 상충관계"}를 분석하였다.` : "";

  const drawCrisis = () => {
    const next = crisisCards[Math.floor(Math.random()*crisisCards.length)];
    setCrisis(next);
    setSelected([]);
    setResolved(false);
    setCopied(false);
  };
  const resetGame = () => {
    setGameStep(0);
    setCrisis(null);
    setSelected([]);
    setResolved(false);
    setCopied(false);
  };
  const nextStage = () => {
    if (gameStep===3) setResolved(true);
    setGameStep(step=>Math.min(4,step+1));
  };
  const togglePolicy = (id:string) => {
    setResolved(false);
    setCopied(false);
    setSelected(current => {
      if (current.includes(id)) return current.filter(item=>item!==id);
      const card = policyCards.find(item=>item.id===id)!;
      const currentCost = policyCards.filter(item=>current.includes(item.id)).reduce((sum,item)=>sum+item.cost,0);
      if (current.length>=3 || currentCost+card.cost>8) return current;
      return [...current,id];
    });
  };

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top"><span>FS</span> 식량안보 전략 연구소</a>
        <div className="navlinks"><a href="#evidence">근거</a><a href="#climate">기후위기</a><a href="#lab">전략게임</a><a href="#career">진로</a></div>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow">기후변화와 지속 가능한 진로 × 경제·경영</div>
        <h1>밀 2%의 경고,<br/><em>쌀 99.1%의 기반</em></h1>
        <p className="lead">우리 식량은 어디에서 오고, 국제 충격은 식탁까지 얼마나 걸릴까? 쌀과 밀의 대조를 통해 기후위기 시대의 공급망과 지속 가능한 진로를 탐구합니다.</p>
        <div className="actions"><a className="primary" href="#climate">기후위기 탐구 시작</a><a className="secondary" href="#lab">전략게임 시작 →</a></div>
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

      <section className="dark section" id="climate">
        <div className="section-head"><span>02 / 기후변화와 곡물경제</span><h2>기후 충격은 생산지가 아니라 공급망 전체를 흔든다</h2><p>쌀은 국내 기후위험에, 밀은 해외 산지·환율·운송이 결합된 복합위험에 노출됩니다. 두 곡물을 비교해 기후위기가 경제 문제로 전환되는 경로를 추적합니다.</p></div>
        <div className="origin">
          <div className="rice-card"><span>RICE · 국내 기반</span><h3>쌀</h3><strong>국내 생산 376.4만t</strong><p>높은 자급률은 강점이지만, 태풍·폭염·농가 고령화와 경지 감소가 생산 기반을 흔들 수 있습니다.</p></div>
          <div className="wheat-card"><span>WHEAT · 글로벌 공급망</span><h3>밀</h3><div className="stack"><i style={{width:"51.8%"}}>호주 51.8</i><i style={{width:"26.2%"}}>미국 26.2</i><i style={{width:"10.1%"}}>EU 10.1</i><i>기타</i></div><p>2023년 관세청 수입 중량 기준. 두 국가 집중도 78%는 특정 지역 충격에 민감한 구조를 뜻합니다.</p></div>
        </div>
        <div className="missions climate-missions">
          {[
            ["① 생산위험","폭염·가뭄·집중호우가 수확량과 품질의 변동성을 어떻게 키우는지 비교한다."],
            ["② 집중위험","밀 수입 상위 2개국 비중 78%와 HHI 약 3,555가 의미하는 조달 취약성을 해석한다."],
            ["③ 가격전이","기후 충격이 선물가격·환율·운임·기업 원가를 거쳐 식탁까지 이동하는 시차를 분석한다."],
            ["④ 전환비용","국내 생산 확대가 토지·물·에너지·재정에 만드는 비용과 편익을 함께 계산한다."],
            ["⑤ 공정한 적응","저소득 소비자, 고령농, 청년농에게 기후위험과 정책 혜택이 어떻게 배분되는지 묻는다."],
            ["⑥ 지속가능 진로","공급망·기업전략·정책평가·농촌사회 중 내 진로의 분석도구로 해결안을 설계한다."],
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
        <div className="section-head"><span>04 / 게임 설계 논리</span><h2>기후자료가 ‘전략적 선택’이 되는 과정</h2><p>합계를 맞추는 활동이 아니라, 전공별 역할을 맡아 불완전한 정보와 상충하는 KPI 속에서 의사결정을 내리도록 설계했습니다.</p></div>
        <div className="story-route">
          {[
            ["발견","쌀 99.1%와 밀 2.0%의 격차를 보고 “왜 같은 곡물인데 다른가?”라는 질문을 만든다."],
            ["검증","KASS·통계청·관세청 자료의 연도, 단위, 식량용·사료용 범위를 구분한다."],
            ["위기","무작위 기후·금융·물류 위기 카드가 기존 공급망의 약점을 드러낸다."],
            ["선택","대응역량 8 안에서 정책 카드 최대 3장을 고르고 시너지와 부작용을 감수한다."],
            ["성찰","KPI·HHI·비용효과를 해석하고 내 전공의 분석도구로 후속 전략을 제안한다."],
          ].map(([title,text],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><b>{title}</b><p>{text}</p></article>)}
        </div>
        <div className="game-structure">
          <div><small>플레이어</small><b>2035 기후·식량 전략회의</b><p>글로벌 조달·기업기획·농업경제·농촌전환 중 하나의 전문 역할을 맡습니다.</p></div>
          <div><small>갈등</small><b>모든 지표를 동시에 높일 수 없다</b><p>가격 안정, 공급 회복력, 농가소득, 환경 지속성 사이에서 우선순위를 선택합니다.</p></div>
          <div><small>승리 조건</small><b>역할별 KPI 미션 달성</b><p>같은 카드라도 전공별 성공조건이 다릅니다. 결과의 장점·부작용·보완책을 설명해야 탐구가 완성됩니다.</p></div>
        </div>
        <div className="narrative"><span>GAME BRIEF</span><p>“2035년 기후·식량 전략회의가 소집됐다. 위기의 종류는 아직 알 수 없고 모든 정책을 동시에 시행할 역량도 없다. 당신은 전공별 책임자로서 대응 카드 3장 이내를 선택하고, 가격·공급·농가·환경과 수입집중도 사이의 상충관계를 이사회에 설명해야 한다.”</p></div>
      </section>

      <section className="lab" id="lab">
        <div className="section-head"><span>05 / HORIZONTAL STORY GAME</span><h2>한 장면에, 한 가지 선택만</h2><p>자료를 읽는 화면과 플레이 화면을 분리했습니다. 아래 게임은 브리핑부터 결과까지 다섯 장면을 좌우로 넘기며 진행합니다.</p></div>

        <div className="game-purpose">
          <span>WHY THIS GAME?</span>
          <h3>기후변화가 만든 공급망의 약한 고리를 찾아 끊는 것</h3>
          <p>통계는 위험의 크기를 보여주지만, 실제 식량안보는 무엇을 먼저 지키고 어떤 비용을 감수할지 선택하는 문제입니다. 게임에서 내린 결정은 마지막에 진로 후속 탐구로 바뀝니다.</p>
        </div>

        <div className="game-shell">
          <div className="game-hud">
            <b>2035 FOOD SECURITY</b>
            <div><span>ROLE <strong>{gameStep>0?gameRoles[gameRole].major:"미선택"}</strong></span><span>CRISIS <strong>{crisis?.label??"미공개"}</strong></span><span>CARDS <strong>{selected.length}/3</strong></span></div>
          </div>
          <div className="game-progress">
            {["브리핑","역할","위기","대응","결과"].map((label,i)=><span key={label} className={gameStep===i?"active":gameStep>i?"done":""}>{String(i+1).padStart(2,"0")} {label}</span>)}
          </div>

          <div className="stage-viewport">
            {gameStep===0&&<div className="game-stage briefing-stage">
              <div className="stage-kicker">MISSION BRIEFING</div>
              <h3>당신의 목표는<br/><em>모든 점수를 높이는 것</em>이 아니다</h3>
              <p>제한된 대응역량으로 단기 가격, 장기 공급, 농가소득, 기후 적응 사이의 우선순위를 정하고 그 선택을 전공의 언어로 방어하세요.</p>
              <div className="brief-objectives"><div><b>읽기</b><span>위기가 어디에서 시작됐는가</span></div><div><b>선택</b><span>무엇을 지키고 무엇을 감수할 것인가</span></div><div><b>남기기</b><span>결정을 진로 탐구로 어떻게 확장할 것인가</span></div></div>
              <button className="hero-game-button" onClick={()=>setGameStep(1)}>임무 수락 →</button>
            </div>}

            {gameStep===1&&<div className="game-stage">
              <div className="stage-kicker">STAGE 01 · ROLE</div><h3>어떤 전문가로 판단할까요?</h3><p className="stage-copy">전공을 고르면 성공조건이 달라집니다. 직업명이 아니라 ‘문제를 보는 방식’을 선택하세요.</p>
              <div className="role-select stage-role-select">
                {gameRoles.map((role,i)=><button key={role.name} className={gameRole===i?"active":""} onClick={()=>{setGameRole(i);setResolved(false)}} aria-pressed={gameRole===i}><small>{role.major}</small><b>{role.name}</b><span>{role.mission}</span></button>)}
              </div>
              <div className="stage-nav"><button onClick={()=>setGameStep(0)}>← 브리핑</button><button className="next" onClick={nextStage}>역할 확정 →</button></div>
            </div>}

            {gameStep===2&&<div className="game-stage crisis-stage">
              <div className="stage-kicker">STAGE 02 · CRISIS</div><h3>기후위기는 혼자 오지 않습니다</h3><p className="stage-copy">카드를 뒤집어 이번 라운드의 공급망 충격을 확인하세요.</p>
              <div className={crisis?"big-crisis-card revealed":"big-crisis-card"}>
                {crisis?<><small>{crisis.tag}</small><b>{crisis.label}</b><p>{crisis.note}</p></>:<><small>CLASSIFIED EVENT</small><b>?</b><p>기후·금융·물류·국내 생산 중 하나의 위기</p></>}
              </div>
              <button className="draw-button stage-draw" onClick={drawCrisis}>{crisis?"다른 위기 뽑기":"위기 카드 뒤집기"}</button>
              <div className="stage-nav"><button onClick={()=>setGameStep(1)}>← 역할</button><button className="next" disabled={!crisis} onClick={nextStage}>대응 회의로 →</button></div>
            </div>}

            {gameStep===3&&<div className="game-stage">
              <div className="stage-kicker">STAGE 03 · RESPONSE</div>
              <div className="deck-head"><div><h3>대응 카드 최대 3장을 고르세요</h3><p className="stage-copy">카드를 옆으로 넘겨 비교하세요. 역량을 전부 쓰지 않아도 됩니다.</p></div><div className="capacity"><span>대응역량</span><strong>{usedCapacity}/8</strong><small>{synergy?`${synergy.name} 발동`:"카드 조합을 탐색하세요"}</small></div></div>
              <div className="policy-deck horizontal-deck">
                {policyCards.map(card=>{const chosen=selected.includes(card.id);const locked=!chosen&&(selected.length>=3||usedCapacity+card.cost>8);return <button key={card.id} className={chosen?"policy-card chosen":"policy-card"} disabled={locked} onClick={()=>togglePolicy(card.id)} aria-pressed={chosen}><span className="card-top"><small>{card.type}</small><i>{card.cost} 역량</i></span><b>{card.title}</b><p>{card.detail}</p><span className="effect">공급 {card.effects.supply>=0?"+":""}{card.effects.supply} · 가격 {card.effects.price>=0?"+":""}{card.effects.price}</span><span className="downside">대가 · {card.downside}</span></button>})}
              </div>
              <div className="selected-tray"><span>선택한 전략</span><b>{selected.length?selectedCards.map(card=>card.title).join(" + "):"아직 선택하지 않음"}</b></div>
              <div className="stage-nav"><button onClick={()=>setGameStep(2)}>← 위기</button><button className="next" disabled={!selected.length} onClick={nextStage}>전략 제출 →</button></div>
            </div>}

            {gameStep===4&&resolved&&crisis&&<div className="game-stage result-stage">
              <div className="outcome-title"><div><small>STAGE 04 · AFTER ACTION REPORT</small><h3>{missionPassed?"미션 달성 · 전략이 위기를 견뎠습니다":"미션 미달 · 한 번 더 설계해 보세요"}</h3></div><div className={missionPassed?"grade pass":"grade"}>{missionPassed?"PASS":"REVIEW"}</div></div>
              <div className="outcome-grid">
                <div className="metric-panel">{Object.entries({price:"가격 안정성",supply:"공급 회복력",farm:"농가소득",climate:"환경 지속성"}).map(([k,label])=><div className="score" key={k}><span>{label}</span><div><i style={{width:`${scores[k as keyof Metrics]}%`}}/></div><b>{scores[k as keyof Metrics]}</b></div>)}</div>
                <div className="professional-panel"><div><small>수입집중도</small><strong>{hhi.toLocaleString()}</strong><span>HHI {hhi>=2500?"고집중":"완화"} · 숫자가 높을수록 특정 국가 의존이 큼</span></div><div><small>발동한 시너지</small><strong>{synergy?.name??"없음"}</strong><span>{synergy?"정책의 시간·대상이 연결됨":"카드 조합을 바꾸면 추가효과 가능"}</span></div><div><small>감수한 대가</small><p>{selectedCards.map(card=>card.downside).join(" · ")}</p></div></div>
              </div>
              <div className="career-followup"><div><small>NEXT CAREER QUEST · {gameRoles[gameRole].major}</small><b>{gameRoles[gameRole].follow}</b></div><button onClick={async()=>{await navigator.clipboard.writeText(reportText);setCopied(true)}}>{copied?"탐구 기록 복사됨 ✓":"탐구 기록 복사"}</button></div>
              <div className="stage-nav result-nav"><button onClick={()=>{setResolved(false);setGameStep(3)}}>← 전략 수정</button><button className="next" onClick={resetGame}>새 게임 시작 ↻</button></div>
              <p className="model-note">HHI와 KPI는 정책의 상충관계를 학습하기 위한 교육용 모형이며 실제 가격이나 정책효과를 예측하지 않습니다.</p>
            </div>}
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
        <div className="section-head"><span>07 / 기후변화와 지속 가능한 진로</span><h2>전공은 직업 이름이 아니라 질문의 방식이다</h2><p>같은 기후충격도 글로벌경영은 조달위험, 경영학은 원가와 고객, 식품자원경제학은 사회적 편익, 농경제사회학은 형평성과 현장 수용성으로 해석합니다.</p></div>
        <div className="career-tabs">{careers.map((c,i)=><button className={career===i?"active":""} onClick={()=>setCareer(i)} key={c.name}>{c.name}</button>)}</div>
        <div className="career-card">
          <span>나의 역할</span><h3>{careers[career].role}</h3>
          <div><b>탐구 질문</b><p>{careers[career].question}</p></div>
          <div><b>후속 산출물</b><p>{careers[career].output}</p></div>
        </div>
        <div className="career-toolkit">
          <div><small>ANALYTIC TOOL</small><b>{careers[career].tool}</b><p>감상이 아니라 전공의 지표와 분석도구로 문제를 설명합니다.</p></div>
          <div><small>ORIGINAL FOLLOW-UP</small><b>{careers[career].project}</b><p>게임 결과에서 생긴 의문을 개인 조사·계산·인터뷰로 확장합니다.</p></div>
          <div><small>STUDENT RECORD KEYWORD</small><b>{careers[career].keyword}</b><p>수치 선택과 실제 산출물을 함께 남겨 진로 연계의 근거를 만듭니다.</p></div>
        </div>
        <div className="record">
          <b>플레이 로그를 탐구의 증거로</b>
          <p>“기후 충격이 생산량 감소에서 국제가격·환율·기업 원가·소비자 가격으로 전이되는 경로를 분석함. 선택한 정책 카드의 결합효과와 숨은 비용을 비교하고, {careers[career].name} 관점에서 성과 KPI와 실행 가능한 보완전략을 설계함.”</p>
          <small>실제 위기 카드, 선택 정책, 감수한 상충관계, 후속 산출물을 넣어 본인의 탐구 과정으로 바꾸세요.</small>
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
