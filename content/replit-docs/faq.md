# 자주 묻는 질문 (FAQ)

Replit 사용 중 자주 묻는 질문들을 모았어요. 계정 관리, 문제 해결, 결제, 주요 기능 사용법 등을 다룹니다.

## 일반 질문

### 코드 관련 도움은 어디서 받아?
[Replit AI](/replit-docs/agent)를 쓰세요! Workspace에서 새 탭 열고 **AI** 검색하면 돼요.

Replit AI가 도와줄 수 있는 것:
- 새 프로젝트 설정
- 코드 관련 질문 답변
- 아이디어 구체화

더 많은 리소스는 [Community Hub](https://replit.com/community)에서 찾아보세요.

### Replit 사용 중 문제가 생겼어요
1. 로그인하세요
2. 페이지 오른쪽 상단 **?** 아이콘 클릭
3. 도움말 찾기

더 자세한 지원 정책은 [support policy doc](/legal-and-security-info/support-policy)를 참고하세요.

### 결제 관련 도움이 필요해요
먼저 **Settings**에서 해결책을 찾아보세요. 안 되면:
1. 로그인
2. 오른쪽 상단 **?** 클릭
3. 지원 요청

### 계정 접속이 안 돼요
`support@replit.com`으로 이메일 보내주세요. 
포함할 정보:
- 계정 username
- 로그인 ID

### Replit 지원팀 응답은 언제 와?
**운영 시간:** 월요일~금요일, 오전 9시~오후 8시 (EST, UTC-5)

주말/공휴일에는 응답이 늦을 수 있어요.

### 삭제한 폴더 복구하기
1. 프로필 아이콘 (오른쪽 상단) 클릭
2. **CLUI** 선택
3. 검색창에 `restore` 입력
4. **restore-folder** 선택
5. 복구할 폴더 선택

> **중요:** 삭제 후 **30일** 지나면 영구 삭제돼요. 복구 불가!

### 삭제한 Replit App 복구하기
1. 프로필 아이콘 클릭
2. **CLUI** 선택
3. `restore` 검색
4. **restore-repl** 선택
5. 복구할 앱 선택

> **중요:** 삭제 후 **30일** 지나면 영구 삭제돼요. 복구 불가!

### Replit App이 로딩 안 돼요
차례대로 시도해보세요:

1. **인터넷 연결 확인**
   - [Speedtest](https://www.speedtest.net/)로 속도 확인

2. **다른 브라우저 시도**
   - Chrome, Firefox, Safari, Edge 등

3. **JavaScript 활성화 확인**
   - 브라우저 설정에서 JavaScript가 켜져 있는지 확인

4. **가상 머신 재시작**
   - Shell에서 `kill 1` 명령어 실행
   - Linux 가상 머신이 재시작됨

5. **Replit 서비스 상태 확인**
   - [Service Status](https://status.replit.com) 접속
   - "All systems are go!" 인데도 문제 있으면 [Replit Support](https://replit.com/support) 연락

### 큰 파일 업로드하는 법
GUI 업로드로 안 되면 `scp` (Secure Copy)를 쓰세요.

[SSH](/replit-workspace/ssh)로 파일 전송:
```bash
scp filename username@ip_address:/home/username
```

디렉토리 전체도 복사 가능해요.

### 크레딧 잔액 확인하기
[https://replit.com/~/cli/account/usage-credits-balance](https://replit.com/~/cli/account/usage-credits-balance)에서 확인하세요.

## 계정 관련

### 로그인이 안 돼요
1. **이메일과 비밀번호 확인**
   - 오타 없는지 체크

2. **비밀번호 재설정**
   - [forgot password 페이지](https://replit.com/forgot)
   - 스팸 폴더 확인! (`notifications@replit.com`)

3. **다른 브라우저 시도**
   - Chrome, Firefox 등

안 되면 [Contact Support](https://replit.com/support)에 문의하세요.

### Google/GitHub로 가입했는데 이메일 변경하려면?
비밀번호가 필요해요. 소셜 로그인은 비밀번호가 없으니 먼저 만들어야 해요.

**비밀번호 만들기:**
1. 로그아웃
2. 로그인 페이지에서 [forgot password](https://replit.com/forgot) 클릭
3. 이메일 주소 입력
4. 이메일로 온 링크로 비밀번호 생성
   - 30분까지 걸릴 수 있음
   - 스팸 폴더 확인!
5. 로그인 후 [Settings](https://replit.com/settings)에서 이메일 변경

### username 변경하기
Replit 사용자는 username을 **딱 한 번**만 바꿀 수 있어요.

1. [CLUI](https://replit.com/~/cli/account/change-username?run=1) 접속
2. **change-username** 선택
3. 새 username 입력

> **주의:** 한 번 바꾸면 다시 못 바꿔요!

옵션이 안 보이면 이미 한 번 바꾼 거예요.

### Explorer 모드가 뭐야?
**Explorer 모드:** 개발 중인 새 기능을 미리 써볼 수 있는 모드

활성화 방법:
1. [Settings](https://replit.com/settings) 열기
2. **Account** 또는 **User** 섹션 찾기
3. **Explorer** 토글 켜기

새 기능을 먼저 써보고 싶은 사람들에게 추천!

## 빠른 해결 팁

### 자주 쓰는 링크
- [Replit Support](https://replit.com/support)
- [Community Hub](https://replit.com/community)
- [Service Status](https://status.replit.com)
- [Account Settings](https://replit.com/settings)
- [CLUI](https://replit.com/~/cli)

### 문의하기 전 체크리스트
- [ ] 브라우저를 다시 시작해봤어?
- [ ] 다른 브라우저로 시도해봤어?
- [ ] 인터넷 연결이 정상이야?
- [ ] [Service Status](https://status.replit.com) 확인했어?
- [ ] Settings에서 해결책을 찾아봤어?

## 체크

- [ ] 문제 해결 방법을 알았어
- [ ] 계정 관리하는 법을 배웠어
- [ ] 지원 받는 방법을 파악했어
- [ ] CLUI로 복구하는 법을 알았어
- [ ] Explorer 모드가 뭔지 이해했어

> **원본 문서 보기:** [https://docs.replit.com/faq.md](https://docs.replit.com/faq.md)
