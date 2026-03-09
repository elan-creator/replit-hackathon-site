# Lark/Slack 알림 연동

> Replit 앱에서 발생하는 이벤트를 팀 메신저로 실시간 알림 받기

* * *

## 🎯 한 줄 정의

**Lark/Slack 알림 연동 = 앱에서 중요한 이벤트(예: 폼 제출, 에러 발생)가 발생했을 때, 팀 메신저로 자동으로 메시지를 보내는 것**

* * *

## 왜 필요한가?

내가 만든 앱이 잘 동작하고 있는지, 혹은 어떤 이벤트가 발생했는지 실시간으로 아는 것은 매우 중요합니다. 특히 업무용 앱의 경우, 누군가 앱을 사용하거나 에러가 발생했을 때 즉시 팀에 공유하여 빠르게 대응할 수 있습니다.

| 알림 연동 없이 😰 | 알림 연동 시 ✨ |
| --- | --- |
| 앱 사용 여부 매번 확인 | 새로운 이벤트 발생 시 즉시 알림 |
| 에러 발생 시 뒤늦게 인지 | 에러 발생 즉시 팀에 공유 → 빠른 대응 |
| 데모 제출 여부 수동 확인 | 데모 제출 시 자동 알림 → 빠르게 피드백 |

### 💬 활용 사례

-   **해커톤 데모 제출 알림**: 참가자가 앱을 제출하면 팀 메신저 채널에 자동 알림
-   **고객 피드백 알림**: 사용자 피드백이 들어오면 담당자에게 즉시 메시지 발송
-   **앱 에러 알림**: 앱에 치명적인 에러가 발생하면 개발팀 채널에 상세 에러 내용 전송
-   **관리자용 이벤트 알림**: 특정 기능 사용량이 급증할 때 관리자에게 알림
-   **새로운 사용자 가입 알림**: 앱에 새로운 사용자가 가입하면 마케팅/운영팀에 알림

* * *

## 📋 따라하기: Lark/Slack 알림 연동 (단계별 가이드)

Lark와 Slack은 "Incoming Webhook"이라는 기능을 통해 외부 앱에서 메시지를 보낼 수 있도록 지원합니다. 이 Webhook URL을 Replit Secrets에 저장하고 앱에서 호출하는 방식으로 연동합니다.

### Step 1: Lark 또는 Slack Webhook URL 생성 (5분)

#### 🅰️ Lark Webhook URL 생성

1.  Lark(Feishu) 앱 또는 웹에서 알림을 받을 **채널(그룹 채팅방)** 선택
2.  채널 우측 상단 `...` (더보기) 클릭 → **"설정"** → **"봇"** 클릭
3.  "맞춤 봇" 섹션에서 **"봇 추가"** 클릭
4.  봇 이름, 설명 입력 (예: `Replit Hackathon Notifier`) → **"추가"**
5.  생성된 봇 클릭 → **"Webhook URL"** 복사 (예: `https://open.larksuite.com/open-apis/bot/v2/hook/...`)

#### 🅱️ Slack Webhook URL 생성

1.  [api.slack.com/apps](https://api.slack.com/apps) 접속 후 **"Create New App"** 클릭 (또는 기존 앱 선택)
2.  **"From scratch"** 선택 → App 이름, 작업 공간 선택 → **"Create App"**
3.  좌측 메뉴 **"Incoming Webhooks"** 클릭
4.  **"Activate Incoming Webhooks"** 토글을 `On`으로 설정
5.  "Webhook URLs for Your Workspace" 섹션 하단 **"Add New Webhook to Workspace"** 클릭
6.  알림을 받을 채널 선택 (예: `#hackathon-alerts`) → **"허용"** 클릭
7.  생성된 **"Webhook URL"** 복사 (예: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXX`)

> 💡 Lark/Slack Webhook URL은 외부에서 메시지를 보낼 수 있는 유일한 통로이므로 **절대 외부에 노출하지 말고 안전하게 보관**해야 합니다.

### Step 2: Replit Secrets에 Webhook URL 등록 (3분)

WebHook URL을 Replit 프로젝트의 "Secrets"에 안전하게 저장합니다. 이렇게 해야 코드에 직접 URL이 노출되지 않습니다.

1.  Replit 프로젝트 접속 (Agent 모드)
2.  좌측 메뉴 자물쇠 모양 **"Secrets"** 아이콘 클릭
3.  "New Secret" 버튼 클릭
4.  `Key`에는 `LARK_WEBHOOK_URL` 또는 `SLACK_WEBHOOK_URL` 입력
5.  `Value`에는 Step 1에서 복사한 **Webhook URL**을 붙여넣기
6.  "Add new secret" 클릭

> ⚠️ **매우 중요**: Secrets에 저장된 값은 코드에서 `process.env.환경변수명`으로 접근할 수 있습니다. 예를 들어 Node.js에서는 `process.env.LARK_WEBHOOK_URL`로 접근합니다.

### Step 3: Replit 코드에서 알림 보내기 (Agent에게 요청)

이제 Agent에게 특정 이벤트가 발생했을 때 Lark/Slack으로 알림을 보내달라고 요청할 수 있습니다.

#### 🔥 Agent 요청 프롬프트 템플릿 (복붙용)

```
내 웹앱에 [어떤 이벤트]가 발생했을 때,
[Lark/Slack]으로 알림을 보내는 기능을 추가해줘.

알림 내용:
- [메시지에 포함할 내용 1]
- [메시지에 포함할 내용 2]

예: "폼 제출 시 제출된 데이터와 제출 시간을 알림"
```

#### ✅ 예시 프롬프트 (Lark)

```
내 웹앱에 폼 제출 기능이 있는데,
사용자가 폼을 제출할 때마다 Lark로 알림을 보내는 기능을 추가해줘.

Lark Webhook URL은 Secrets에 LARK_WEBHOOK_URL로 저장되어 있어.

알림 내용:
- 제목: "새로운 해커톤 앱 제출!"
- 제출자 이름: [폼에서 제출된 이름]
- 앱 아이디어: [폼에서 제출된 아이디어]
- 앱 링크: [폼에서 제출된 링크]
- 제출 시간: [현재 시간]

메시지는 눈에 잘 띄게 카드 형태로 만들어줘.
```

#### ✅ 예시 프롬프트 (Slack)

```
내 웹앱에서 에러가 발생했을 때,
Slack으로 에러 내용을 알림으로 보내는 기능을 추가해줘.

Slack Webhook URL은 Secrets에 SLACK_WEBHOOK_URL로 저장되어 있어.

알림 내용:
- 채널: #hackathon-alerts
- 제목: "🚨 Replit 앱 에러 발생!"
- 에러 내용: [발생한 에러 메시지]
- 발생 시각: [현재 시각]
- 에러 스택 트레이스도 가능하다면 포함해줘.

메시지는 Block Kit 형식을 사용해서 가독성 좋게 만들어줘.
```

* * *

## ⚠️ 트러블슈팅 FAQ

### "알림이 안 와요"

**해결**: 다음을 확인하세요.
1.  Step 1에서 Webhook URL을 정확히 복사했는지?
2.  Step 2에서 Secrets 키 이름(예: `LARK_WEBHOOK_URL`)과 값이 정확한지?
3.  알림을 보낼 채널(Lark 그룹 채팅방, Slack 채널)에 봇이 제대로 추가되었는지?
4.  Replit 앱이 알림을 보내는 코드가 실제로 실행되는지? (Agent에게 코드 확인 요청)

### "봇 이름이나 아이콘을 바꾸고 싶어요"

**해결**: Lark/Slack 앱 설정에서 봇의 프로필(이름, 아이콘)을 수정할 수 있습니다.

### "Agent가 자꾸 코딩 에러를 내요"

**해결**: HTTP 요청을 보내는 부분에서 에러가 발생할 수 있습니다. Agent에게 에러 메시지를 정확히 복사해서 보여주세요. "Node.js `axios` 라이브러리를 사용해서 Webhook URL로 POST 요청을 보내줘"와 같이 라이브러리를 지정해볼 수 있습니다.

### "메시지 디자인을 바꾸고 싶어요"

**해결**: Lark와 Slack은 메시지를 더 예쁘게 꾸밀 수 있는 "Message Card" 또는 "Block Kit Builder"를 제공합니다. Agent에게 "Lark Message Card 형식으로 알림을 보내줘" 또는 "Slack Block Kit 형식으로 알림을 보내줘"라고 요청해보세요.

* * *

## ✅ 체크

- [ ] Lark/Slack 알림 연동의 필요성 및 활용 사례 이해
- [ ] Webhook URL 생성 및 Replit Secrets에 등록하는 방법 이해
- [ ] Agent에게 알림 기능을 요청하는 프롬프트 작성법 이해

👉 **다음**: [실전 과제: 업무형 앱 만들기](../5-실전과제/업무형-앱-만들기)
