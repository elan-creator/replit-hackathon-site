# GitHub 연동

> Replit에서 만든 코드를 GitHub로 백업하고, 팀과 협업하는 법

* * *

## 🎯 GitHub이 뭐야?

**GitHub = 코드의 구글 드라이브**

문서를 구글 드라이브에 저장하듯, 코드를 GitHub에 저장합니다. 단순 백업이 아니라:

- 📝 **변경 이력 추적** — 누가 언제 뭘 바꿨는지 전부 기록
- 🔄 **되돌리기** — 잘못 수정했으면 이전 버전으로 복구
- 👥 **협업** — 여러 명이 같은 프로젝트를 동시에 작업

* * *

## 📸 실제 GitHub 레포 화면

아래는 이 해커톤 프로젝트의 실제 GitHub 페이지입니다:

![GitHub 레포지토리 실제 화면](/images/github-repo-page.jpg)

| 요소 | 설명 |
|------|------|
| **main / 3 Branches** | 브랜치 3개 (main, local, replit) |
| **26 Commits** | 지금까지 26번 저장(커밋)됨 |
| **폴더 목록** | app, components, content, lib, public 등 프로젝트 구조 |
| **커밋 메시지** | 각 파일 옆에 "마지막으로 뭘 바꿨는지" 메모가 보임 |
| **Languages** | TypeScript 96.4% — 코드 비율 자동 분석 |

> Replit에서 Push하면 이 화면에 자동으로 반영됩니다!

* * *

## 🔗 Replit에서 GitHub 연결하기

### 방법 1: 새 프로젝트에서 GitHub 연결

Replit 에디터 왼쪽 사이드바에서 **Git 아이콘** (브랜치 모양)을 클릭합니다.

1. **"Connect to GitHub"** 클릭 → GitHub 로그인
2. 레포 이름 입력 (예: `my-hackathon-project`)
3. Public/Private 선택 → **Create**

끝! 이제 Replit과 GitHub이 연결됐습니다.

### 방법 2: GitHub 레포를 Replit으로 가져오기 (Import)

이미 GitHub에 코드가 있다면, Replit으로 바로 가져올 수 있습니다:

![Import to Replit 실제 화면](/images/replit-import-to-replit.jpg)

**사이드바 → "Import code or design"** 을 클릭하면 이 화면이 나옵니다:

| 소스 | 설명 |
|------|------|
| **GitHub** | GitHub 레포를 통째로 가져오기. 가장 많이 쓰는 방법! |
| **Figma Design** | 피그마 디자인을 Replit Agent가 실제 앱으로 변환 |
| **Bolt** | Bolt에서 만든 프로토타입을 가져와서 이어서 개발 |
| **Lovable** | Lovable 프로젝트를 Replit으로 이전 |
| **Bitbucket** | Bitbucket 레포를 가져오기 |
| **Vercel** | Vercel 사이트를 Replit으로 이전 |
| **Zip file** | zip 파일로 직접 업로드 |

GitHub를 선택하면 이 화면이 나옵니다:

![Import from GitHub 실제 화면](/images/replit-import-github.jpg)

1. **GitHub Repo URL**에 주소를 붙여넣거나, 내 계정에서 레포를 선택
2. **Owner** — 어느 워크스페이스에 넣을지 선택 (개인 or 팀)
3. **Privacy** — Internal(팀만 보기) 또는 Public(전체 공개)
4. **"Import from Github"** 클릭 → 끝!

> **해커톤 팁**: 다른 AI 도구(Bolt, Lovable 등)에서 시작한 프로젝트도 Replit으로 가져와서 이어서 작업할 수 있어요!

* * *

## 📸 실제 화면으로 배우기

아래는 실제 해커톤 프로젝트의 Git 패널입니다:

![Replit Git 패널 실제 화면](/images/replit-git-panel.jpg)

### 화면 구성 설명

#### 1️⃣ 상단: Remote Updates (원격 업데이트)

```
origin/replit · upstream
[Sync Changes 4 ↑]  [Pull]  [Push]
```

- **origin/replit** — 현재 작업 중인 브랜치 이름
- **Sync Changes 4 ↑** — 아직 GitHub에 안 올린 변경사항 4개
- **Pull** — GitHub에서 최신 코드 가져오기 (다른 사람이 수정한 거)
- **Push** — 내 변경사항을 GitHub에 올리기

#### 2️⃣ 중간: Commit (커밋 = 저장 단위)

```
Message: [Summary]
Review Changes: 4 changes
  route.ts       [A]
  page.tsx        [A]
  site-auth.ts    [A]
  middleware.ts   [A]

[✅ Stage and commit all changes]
```

- **Message** — 이번에 뭘 바꿨는지 메모 (예: "로그인 기능 추가")
- **4 changed files** — 수정된 파일 4개
- **[A]** — Added(새로 만든 파일)라는 뜻
- **Stage and commit all changes** — 이 버튼 누르면 변경사항이 저장됨!

#### 3️⃣ 하단: 커밋 히스토리 (변경 기록)

```
↓ Not pushed to remote (아직 GitHub에 안 올림)
• Transitioned from Plan to Build mode — 2 minutes ago
• Improve prompt generation for faster app development — 18 minutes ago
• Add automatic prompt generation — 31 minutes ago

↓ Up to date with remote (GitHub에 이미 올라간 것)
• Fix service deletion error — 1 hour ago
• Add secure deletion functionality — 1 hour ago
```

**"Not pushed to remote"** = 내 컴퓨터(Replit)에만 있고 GitHub에는 아직 안 올라간 상태
**"Up to date with remote"** = GitHub에도 올라간 상태

* * *

## 🔄 일상적인 작업 흐름

### 매번 작업할 때 (3단계)

```
1. 코드 수정 (Replit Agent한테 시키거나 직접 수정)
     ↓
2. Commit (Git 탭 → 메시지 쓰기 → "Stage and commit all changes")
     ↓
3. Push (Push 버튼 → GitHub에 업로드)
```

**비유하면:**
- **수정** = 문서를 편집하는 것
- **Commit** = "저장" 버튼 누르기
- **Push** = 구글 드라이브에 업로드

### 꿀팁 💡

- **커밋 메시지는 짧고 명확하게**: "버그 수정" (X) → "로그인 버튼 클릭 시 에러 수정" (O)
- **자주 커밋하세요**: 큰 변경 한 번보다, 작은 변경 여러 번이 안전해요
- **Replit Agent가 자동으로 커밋해주기도 합니다**: Plan → Build 전환 시 자동 커밋!

* * *

## 🌳 브랜치 = 안전한 실험실

### 브랜치가 뭐야?

**브랜치 = 복사본에서 작업하기**

원본(main)을 건드리지 않고, 복사본에서 실험할 수 있습니다:

```
main (원본) ──────────────────── 안전하게 보존
  └── my-feature (복사본) ──── 여기서 마음껏 실험
                                 ↓
                            잘 되면 → main에 합치기 (merge)
                            망하면 → 복사본만 삭제
```

### 📺 참고 영상

브랜치 개념이 아직 헷갈린다면 이 영상을 참고하세요:

👉 [GitHub 브랜치 만들기 (영상)](https://youtu.be/RYfO6-hPBdw?si=Y53j4vhxW0gTs4KO)

### 언제 쓰나요?

- 새로운 기능을 실험할 때
- 여러 명이 동시에 작업할 때
- 위험한 변경을 시도할 때 (망해도 원본은 안전!)

### 실제 사용 예시

이 해커톤 수업자료 프로젝트에서 실제로 브랜치를 이렇게 사용하고 있습니다:

```
main ─────────────── 최종 완성본
  ├── local ──────── 수업자료 콘텐츠 작업 (로컬에서)
  └── replit ─────── 앱 기능 개발 (Replit에서)
```

- **local 브랜치**: 수업자료 마크다운 파일 수정
- **replit 브랜치**: 아이디어 제출, 피드백 같은 기능 개발
- 각자 작업 후 **main에 합치기 (merge)**

### Replit에서 브랜치 바꾸기

Git 패널 상단의 브랜치 이름 (예: `replit`)을 클릭하면 다른 브랜치로 전환할 수 있습니다.

* * *

## 🤝 팀 협업할 때

### 혼자 작업할 때

```
Replit에서 수정 → Commit → Push → 끝!
```

### 팀으로 작업할 때

```
1. 작업 시작 전: Pull (다른 사람이 올린 최신 코드 받기)
2. 내 작업하기
3. Commit → Push (내 작업 올리기)
4. 충돌 나면? → 어느 쪽을 쓸지 선택
```

### 충돌(Conflict)이란?

같은 파일의 같은 줄을 두 사람이 동시에 수정한 경우에만 발생합니다.

```
나: "버튼 색을 파란색으로 바꿈"
팀원: "버튼 색을 빨간색으로 바꿈"
     → 충돌! 어느 색을 쓸지 선택해야 함
```

**걱정 마세요**: 충돌은 드물고, 발생해도 Replit이 어느 부분이 충돌인지 보여줍니다.

* * *

## 🛡️ 왜 GitHub을 써야 하나요?

| 상황 | GitHub 없이 | GitHub 있으면 |
|------|-------------|--------------|
| 코드 날아감 | 처음부터 다시 😱 | GitHub에서 복구 ✅ |
| "아까 그 버전으로" | 기억에 의존 | 커밋 히스토리에서 찾기 ✅ |
| 팀 협업 | 파일 주고받기 | 자동 동기화 ✅ |
| 포트폴리오 | "만들었는데 증거가..." | GitHub 링크 공유 ✅ |

> **해커톤 팁**: 해커톤 끝나고 GitHub에 코드가 남아있으면, 나중에 포트폴리오로 쓸 수 있어요!

* * *

## ✅ 체크

- [ ] GitHub = 코드의 구글 드라이브
- [ ] Commit = 저장, Push = 업로드
- [ ] 브랜치 = 안전한 실험실
- [ ] 자주 커밋, 짧은 메시지

👉 **다음**: [실전 프롬프트 팁](./실전-프롬프트-팁)
