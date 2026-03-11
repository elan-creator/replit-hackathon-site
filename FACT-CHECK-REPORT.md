# 팩트 체크 리포트 — Replit 해커톤 수업자료

> 2026년 3월 11일 기준, 27개 파일 전수 검사

---

## 🔴 핵심 발견: Replit 요금제 변경 반영 필요

**2026년 2월 25일부로 Replit 요금제가 변경되었습니다.** 문서 전체에서 이 변경사항을 반영해야 합니다.

| 항목 | 문서 기재 | 현재 실제 | 상태 |
|------|----------|----------|------|
| Core 가격 | $25/월 | **$20/월** | ❌ 오류 |
| Starter 가격 | $9/월 | **무료 (Free)** | ❌ 오류 |
| Pro 플랜 | 일부 문서에 $100/월 기재 | $100/월 ✅ | ✅ 정확 |
| Teams 플랜 | 일부 문서에 존재 | **2026년 3월 6일부 sunset → Pro 전환** | ❌ 오류 |

---

## 파일별 팩트 체크 결과

---

### 파일: content/references/2-레플릿-설명/Replit-요금-총정리.md

✅ **정확한 사실:**
- 배포 유형 4가지 (Static, Autoscale, Reserved VM, Scheduled) — 공식 문서와 일치
- Autoscale 요금: Base $1/월, CU $3.20/백만, Requests $1.20/백만 — 공식 문서 정확 일치
- Reserved VM 가격: Shared Medium $20, Dedicated Small $40, Medium $80, Large $160 — 정확
- Static 배포 아웃바운드 $0.10/GiB — 정확
- CU 계산법 (CPU 1초=18CU, 메모리 1GB 1초=2CU) — 정확
- 15분 무활동 후 잠자기 — 정확
- 인터랙티브 요금 계산기 URL (deployment-pricing.replit.app) — 유효

❌ **오류 발견:**
- **Core 가격 $25/월** → 현재 **$20/월**로 인하됨 (2026-02-25 적용)
- **Starter $9/월** → 현재 Starter는 **무료(Free)** 플랜. $9/월 플랜은 존재하지 않음
- 요금제 표에 **Teams 플랜 없음** → 맞지만, **Pro $100/월**이 추가되어야 함

💡 **업데이트 필요:**
- 요금제 비교표 전체 갱신 (Free/Starter=무료, Core=$20, Pro=$100, Enterprise=별도)
- Core 기반 비용 계산 전부 $25→$20으로 수정
- mfitlab 월 운영비 "$26~30" → Core $20 기준으로 재계산 필요 ("$21~25" 수준)
- 요금 비교 기준일 "2026년 3월 기준" 표기 유지하되 실제 가격 반영

---

### 파일: content/가이드/0-시작하기/Replit-소개.md

✅ **정확한 사실:**
- Replit = 브라우저 기반 올인원 개발 플랫폼 — 정확
- Agent 기능 설명 (자연어 → 앱 생성) — 정확
- 배포 유형 3가지 (Static, Autoscale, Reserved VM) — 정확 (Scheduled 빠졌지만 핵심만 소개라 OK)
- App vs Design 두 모드 존재 — 공식 문서 확인, **현재 존재하는 기능**
- Replit Database = PostgreSQL — 정확
- GitHub 연동 지원 — 정확

⚠️ **확인 필요:**
- "PostgreSQL DB (10GB 무료)" — Core 크레딧 내 무료인지 구체적 용량 한도 확인 필요
- Replit Auth 기능 — 현재 공식 문서에서 직접 확인 못 함 (존재 여부 확인 필요)

❌ **오류 발견:**
- **Ghostwriter** — "Replit의 미래"로 소개했지만, Ghostwriter 브랜드는 이미 **Replit AI로 통합/리브랜딩**됨. 별도 기능으로 소개하면 혼란 야기
- **Code Repair** — 마찬가지로 별도 기능이 아닌 Agent의 일부로 통합됨

💡 **업데이트 필요:**
- "Replit의 미래" 섹션의 Ghostwriter, Code Repair 설명을 현재 Replit AI/Agent 체계에 맞게 수정
- 또는 해당 섹션 삭제 (이미 존재하는 기능을 "미래"로 소개하면 혼란)

---

### 파일: content/references/1-사례/실제-사례-mfitlab.md

✅ **정확한 사실:**
- 기술 스택 (React 19, Express 5, TypeScript, PostgreSQL, Tailwind CSS) — 일관
- 개발 비용 약 $89 (80 체크포인트 × ~$0.8 + Core $25) — 내부 일관성 OK
- 작업 유형별 비용 분포 (디자인/레이아웃 38%) — 내부 일관성 OK
- Resend 무료 티어 월 3,000건, 일 100건 — 정확
- 배포 프로세스 (Publish 버튼 클릭 → 자동 빌드) — 정확
- SSL 자동 발급 — 정확

❌ **오류 발견:**
- **Replit Core 구독 $25/월** — 현재 **$20/월**
- **월 운영비 "$26~30"** — Core가 $20으로 인하되었으므로 **"$21~25"**로 수정 필요

💡 **업데이트 필요:**
- 개발 비용 합계: $64 + $25 = $89 → $64 + $20 = **$84**로 수정 (또는 개발 시점 가격이 $25였다면 주석 추가)
- 월 운영비 표에서 Core $25 → $20 반영

---

### 파일: content/references/1-사례/실제-사례-writer.md

✅ **정확한 사실:**
- 기술 스택 (Python, FastAPI, Claude API, Tavily) — 일관
- 글 1편당 약 $0.19 (≈260원) — API 호출 비용 세부 합산과 일치
- 번역 편당 $0.15~0.30 — 합리적 범위
- Tavily 무료 1,000회/월 — **현재 Tavily 공식 사이트 확인: 1,000 API credits/월 무료** ✅
- Unsplash/Pexels 무료 API — 정확 (두 서비스 모두 무료 API 제공 중)
- 배포 비용 $6.95 (Reserved VM $5.09 + Autoscale $1.86) — 내부 일관

✅ **비용 검증:**
- 월 운영비 $113 산출근거: Claude API 글생성 ~540편×$0.19=~$103 + 번역 16편×$0.22=~$3.5 + Tavily $5~10 = **~$113** ✅ 계산 맞음
- 편당 260원 = $0.19 × ₩1,370 ≈ ₩260 ✅ (환율 약 1,370원 기준 합리적)

⚠️ **확인 필요:**
- Claude Sonnet 4 가격 (input $3/1M, output $15/1M) — 현재 최신 모델은 **Claude Sonnet 4.6** (같은 가격 $3/$15). 모델명이 "Sonnet 4"인지 "Sonnet 4.6"인지 확인 필요. 가격 자체는 정확.

💡 **업데이트 필요:**
- "Claude Sonnet" 모델명을 현재 최신 버전으로 업데이트 고려 (Sonnet 4.6)

---

### 파일: content/references/2-레플릿-설명/Agent-활용팁.md

✅ **정확한 사실:**
- Plan Mode 기능 설명 — 정확
- Economy / Power / Turbo 3단계 모드 — 정확 (공식 문서 확인)
- Code Optimizations 기능 — 정확
- Checkpoints & Rollback — 정확
- Feedback Widget — 정확
- Secrets (환경변수) 관리 — 정확
- Custom Domains — 정확 (Autoscale, Reserved VM, Static 지원)
- Scheduled Deployments 요금: 스케줄러 $0, 실행당 $1, CU $3.20 — 공식 문서 정확 일치
- 배포 타입별 요금 — 정확 (Static $0.10/GiB, Autoscale $1/$1.20/$3.20, Reserved VM $40/$80/$160)
- Credit Packs 가격표 ($100/$290/$480/$950) — ⚠️ 직접 확인 불가, 공식 문서 참조 필요

⚠️ **확인 필요:**
- Credit Packs 유효기간 6개월 — 직접 확인 불가
- Private Deployments "Teams 구독자만 사용 가능" — Teams가 sunset되므로 Pro/Enterprise로 변경 필요할 수 있음
- Starter Plan "무료 배포 1개 포함 (30일 후 만료)" — 공식 문서 확인: ✅ 정확

💡 **업데이트 필요:**
- "Teams 구독자만" → Pro/Enterprise 기준으로 업데이트 필요

---

### 파일: content/references/2-레플릿-설명/Replit-엔터프라이즈-사례.md

✅ **정확한 사실:**
- 역할별 활용 시나리오 — 주관적 내용이므로 팩트체크 불필요
- "3개월→2주", "8시간→1시간" 등 — 예시 시나리오로 제시된 것이므로 OK

✅ 특별한 오류 없음.

---

### 파일: content/references/2-레플릿-설명/에이전트-질문지.md

✅ 질문 목록이므로 팩트체크 대상 아님. 오류 없음.

---

### 파일: content/references/3-임팩트-만들기/왜-바이브코딩인가.md

✅ **정확한 사실:**
- Boxloop (boxloop.ai) 관련 스토리 — 프로미스나인이 아닌 Boxloop 사업 관련, USER.md에서 오빠의 회사로 확인
- "3일 만에 레플릿으로 데모" → 회사 설립 스토리 — 오빠 본인의 경험담이므로 사실관계 문제 없음
- 마켓핏랩 관련 내용 — Replit 한국 공식 파트너 역할 기술

⚠️ **확인 필요:**
- Boxloop "v1.0.142" 버전, "306명 지원자" 등 구체적 숫자 — 시점에 따라 변할 수 있으나, 작성 시점 기준으로는 OK

✅ 특별한 팩트 오류 없음. (주관적/경험적 내용이 주)

---

### 파일: content/references/3-임팩트-만들기/실전-프롬프트-팁.md

✅ **정확한 사실:**
- 프롬프트 팁 5가지 — 조언/노하우이므로 팩트체크 불필요
- mfitlab 체크포인트 ~80개, 평균 ~$0.8 — 내부 일관
- Writer 19세션, 커밋 63개 — 내부 일관

✅ 특별한 오류 없음.

---

### 파일: content/가이드/0-시작하기/커리큘럼.md

✅ 커리큘럼/일정 안내이므로 팩트 이슈 없음.

---

### 파일: content/가이드/0-시작하기/참가준비가이드.md

✅ **정확한 사실:**
- Replit Agent 모드로 시작 — 정확
- "Pro 계정 불필요" — 정확 (운영측 지원)
- 브라우저만 필요 — 정확

✅ 특별한 오류 없음.

---

### 파일: content/가이드/0-시작하기/주최사-소개.md

✅ **정확한 사실:**
- 마켓핏랩 = Replit 한국 공식 파트너 — 문서 내 일관
- mfitlab.com 개발 비용 $89, 월 운영비 $26~30 — 내부 일관 (단, Core 가격 변경 반영 필요)
- Writer 글 1편 260원, 월 $113 — 내부 일관

❌ **오류 발견:**
- Writer 규모 "생성글 25개" — 실제-사례-writer.md에서는 "생성글 27개"로 기재. **불일치**
- mfitlab 월 운영비 "$26~30" — Core $25 기준. Core $20 반영 시 수정 필요

💡 **업데이트 필요:**
- Writer 생성글 수: 25개 → 27개로 통일 (또는 작성 시점이 다르면 최신 기준으로)
- Core 가격 변경 반영

---

### 파일: content/가이드/1-아이디어-to-MVP/* (5개 파일)

✅ 교육/가이드 내용이므로 대부분 팩트체크 불필요.
- "Agent 모드 선택" — ✅ App 모드에서 Agent 사용 가능 확인
- 배포 유형 "대부분 Autoscale" — ✅ 적절한 조언

✅ 특별한 오류 없음.

---

### 파일: content/가이드/2-고도화/* (5개 파일)

✅ 교육/가이드 내용. 팩트 이슈 없음.

---

### 파일: content/가이드/3-연동-가이드/GitHub-연동.md

✅ **정확한 사실:**
- Import from GitHub 기능 — **현재 존재** (App 생성 시 Import 옵션에서 GitHub 선택 가능)
- Import 소스 목록 (GitHub, Figma, Bolt, Lovable, Bitbucket, Vercel, Zip) — 정확
- Git 사이드바에서 Connect to GitHub — 정확

✅ 특별한 오류 없음.

---

### 파일: content/가이드/3-연동-가이드/Google-Sheets-연동.md

✅ **정확한 사실:**
- GCP 서비스 계정 생성 → JSON 키 → Sheets 공유 방식 — 표준적이고 정확한 방법
- Google Sheets API 무료 등급 대부분 커버 — 정확

⚠️ **확인 필요:**
- GCP Console UI 세부 메뉴 경로 — Google이 UI를 자주 변경하므로 세부 경로가 약간 다를 수 있음. 하지만 전체 흐름은 정확.

✅ 특별한 오류 없음.

---

### 파일: content/가이드/3-연동-가이드/Lark-Slack-알림-연동.md

✅ **정확한 사실:**
- Slack Incoming Webhooks — **여전히 지원** (api.slack.com/apps에서 설정)
- Lark 커스텀 봇 Webhook — 표준적 방법
- Replit Secrets 활용법 — 정확

⚠️ **확인 필요:**
- Lark UI 세부 경로 ("채널 → ... → 설정 → 봇") — Lark 버전에 따라 다를 수 있음

✅ 특별한 오류 없음.

---

### 파일: content/가이드/4-실전과제/업무형-앱-만들기.md

✅ 과제 가이드이므로 팩트 이슈 없음.

---

## 팩트 체크 요약

| 구분 | 항목 수 |
|------|---------|
| 총 검사 파일 | 27개 |
| ✅ 정확 | **~85개 항목** |
| ⚠️ 확인 필요 | **7개 항목** |
| ❌ 오류 발견 | **8개 항목** |
| 💡 업데이트 필요 | **10개 항목** |

---

## 🔴 즉시 수정 필요 (Critical)

### 1. Replit Core 가격: $25 → $20 (영향 범위 넓음)

**영향 파일:**
- `Replit-요금-총정리.md` — 요금제 비교표, 월 운영비
- `실제-사례-mfitlab.md` — 개발 비용 합계 ($89→$84), 월 운영비
- `실제-사례-writer.md` — (직접 언급 없으나 관련)
- `주최사-소개.md` — 월 운영비 참조

### 2. Starter 플랜: $9/월 → 무료

**영향 파일:**
- `Replit-요금-총정리.md` — 요금제 비교표

### 3. Teams 플랜 sunset → Pro 전환

**영향 파일:**
- `Replit-요금-총정리.md` — 요금제 비교표
- `Agent-활용팁.md` — Private Deployments "Teams 구독자만"

### 4. Writer 생성글 수 불일치 (25개 vs 27개)

**영향 파일:**
- `주최사-소개.md` — "생성글 25개" → 27개로 통일

---

## 🟡 권장 수정 (Non-critical)

### 5. Ghostwriter/Code Repair 설명 현행화
- `Replit-소개.md` — "Replit의 미래" 섹션에서 이미 통합된 기능을 미래로 소개

### 6. Claude 모델명 업데이트
- "Claude Sonnet 4" → 현재 최신 "Claude Sonnet 4.6" (가격은 동일)

---

## ✅ 검증 완료: 정확한 핵심 데이터

| 항목 | 문서 값 | 검증 결과 |
|------|---------|----------|
| Autoscale Base Fee | $1/월 | ✅ 정확 |
| Autoscale CU | $3.20/백만 | ✅ 정확 |
| Autoscale Requests | $1.20/백만 | ✅ 정확 |
| Reserved VM Shared Medium | $20/월 | ✅ 정확 |
| Reserved VM Dedicated Small | $40/월 | ✅ 정확 |
| Reserved VM Dedicated Medium | $80/월 | ✅ 정확 |
| Reserved VM Dedicated Large | $160/월 | ✅ 정확 |
| Static 아웃바운드 | $0.10/GiB | ✅ 정확 |
| Scheduled 실행당 | $1.00 | ✅ 정확 |
| Claude Sonnet API 가격 | $3/$15 per MTok | ✅ 정확 |
| Tavily 무료 | 1,000회/월 | ✅ 정확 |
| Unsplash/Pexels | 무료 API | ✅ 정확 |
| Resend 무료 | 월 3,000건 | ✅ 정확 |
| mfitlab 개발비 | ~$89 | ✅ 내부 일관 |
| Writer 편당 비용 | ~$0.19 (260원) | ✅ 계산 정확 |
| Writer 월 운영비 | ~$113 | ✅ 산출 근거 정확 |
| App/Design 모드 | 존재 | ✅ 공식 문서 확인 |
| GitHub Import | 지원 | ✅ 공식 문서 확인 |
| Slack Incoming Webhooks | 지원 | ✅ 확인 |

---

*이 리포트는 Replit 공식 문서 (docs.replit.com, replit.com/pricing), Anthropic 공식 모델 페이지, Tavily 공식 사이트를 기반으로 2026년 3월 11일에 작성되었습니다.*
