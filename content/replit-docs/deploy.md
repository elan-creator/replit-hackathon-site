# 앱 배포하기

## 이게 뭐야

Replit에서 만든 앱을 **실제로 동작하는 웹사이트**로 배포하는 방법입니다. 
버튼 하나로 전 세계 누구나 접속할 수 있는 URL이 생겨요.

## 왜 필요해

### 개발 환경 vs 배포 환경

**개발 중 (Preview):**
- 나만 볼 수 있음
- Replit에서만 접속 가능
- 테스트용

**배포 후 (Published):**
- 누구나 볼 수 있음
- 어디서든 접속 가능
- 실제 서비스

## Autoscale Deployments

Replit의 배포는 **Autoscale** 방식이에요. 트래픽에 따라 서버가 자동으로 늘었다 줄었다 해요.

### 언제 쓰면 좋아?
- 트래픽이 들쭉날쭉한 웹 앱
- 전자상거래 사이트
- API 서비스
- 사용자 수가 변하는 서비스

### 특징
- ⚡ **자동 확장:** 트래픽 많으면 서버 자동 증가, 적으면 자동 감소
- 🌐 **커스텀 도메인:** 내 도메인 사용 가능 (또는 `앱이름.replit.app`)
- 🎛️ **설정 가능:** 최대 서버 개수 제한 가능
- 💪 **머신 파워 선택:** CPU/RAM 조합 선택 가능
- 📊 **모니터링:** 로그 확인, 상태 모니터링

## 따라해봐

### 1단계: Publishing 도구 열기

**Tool dock에서:**
1. 왼쪽 **All tools** (모든 도구) 아이콘 클릭
2. **Publishing** 선택
3. **Autoscale** 옵션 선택
4. **Set up your published app** 클릭

**검색으로:**
1. 상단 돋보기 🔍 아이콘 클릭
2. "Publishing" 입력
3. 결과에서 선택

![Autoscale 설정 화면](https://mintcdn.com/replit/jSmYU1wBTvl8UMyc/images/deployments/autoscale/autoscale-deployment-options.png)

### 2단계: 머신 파워 설정

**Edit** 버튼을 눌러서 CPU와 RAM을 선택하세요.

슬라이더로 조정하면:
- CPU 코어 개수
- RAM 용량

**Total per machine** 행에서 **compute unit** 비용을 확인할 수 있어요.

> **Compute Unit:** Replit의 과금 단위. CPU+RAM 조합에 따라 계산돼요.

![머신 파워 설정](https://mintcdn.com/replit/jSmYU1wBTvl8UMyc/images/deployments/autoscale/machine-power.png)

### 3단계: 최대 서버 개수 설정

슬라이더로 **최대 몇 대까지** 서버를 늘릴 수 있는지 설정하세요.

예:
- 머신 1대 = 2 compute units
- 최대 5대 설정 = 최대 10 compute units

공식:
```
최대 compute units = 머신 개수 × 머신당 compute units
```

![최대 머신 개수 설정](https://mintcdn.com/replit/jSmYU1wBTvl8UMyc/images/deployments/autoscale/max-machines.png)

### 4단계: 배포하기

설정 완료했으면 **Publish** 버튼 클릭!

몇 분 안에 앱이 배포되고 URL이 생겨요:
```
https://내앱이름.replit.app
```

## 배포 후 관리하기

### 로그 확인
Publishing 도구에서 실시간 로그를 볼 수 있어요. 에러가 나면 여기서 확인하세요.

### 커스텀 도메인 연결
내 도메인 (예: `myapp.com`)을 연결하고 싶어요?
1. Publishing 설정에서 **Custom Domain** 입력
2. DNS 설정 (Replit이 안내해줘요)
3. 완료!

### 배포 중단하기
사용 안 할 때는 배포를 멈출 수 있어요. 비용 절약!

## 비용 계산하기

Autoscale Deployment는 **사용한 만큼** 비용이 나와요:

1. **Compute Units 계산**
   - 머신 파워 (CPU + RAM) = X units/시간
   - 실행 시간 = Y 시간
   - 총 비용 = X × Y

2. **트래픽 없으면?**
   - 서버가 0대로 줄어듦
   - 비용 거의 안 나옴 💰

3. **트래픽 많으면?**
   - 서버 자동 증가 (설정한 최대치까지)
   - Compute Units 증가

## 자주 묻는 질문

### 무료 플랜으로 배포 가능해?
Starter 플랜에도 배포 기능이 있지만, 제한이 있어요. 실제 서비스는 Core나 Pro 플랜을 추천해요.

### 배포 후 코드 수정하면?
코드 수정하고 다시 Publish 누르면 업데이트돼요.

### 트래픽이 0일 때도 비용 나와?
Autoscale은 사용자가 없으면 서버를 0대로 줄여요. 거의 비용이 안 나와요.

### 커스텀 도메인 필수야?
아니요! `앱이름.replit.app` 도메인으로도 충분해요. 나중에 언제든 커스텀 도메인 추가 가능해요.

## 다음 단계

- [Deployment Monitoring](/cloud-services/deployments/monitoring-a-deployment) — 로그 확인, 앱 모니터링
- [Publishing Costs](/billing/deployment-pricing) — 배포 비용 상세
- [Pricing](https://replit.com/pricing/) — 플랜별 가격
- [Usage Allowances](/billing/about-usage-based-billing/) — 사용량 한도와 과금 단위

## 체크

- [ ] Autoscale Deployment가 뭔지 이해했어
- [ ] 머신 파워를 설정하는 법을 배웠어
- [ ] 최대 서버 개수 제한을 설정했어
- [ ] 배포 방법을 알았어
- [ ] 비용이 어떻게 계산되는지 이해했어

> **원본 문서 보기:** [https://docs.replit.com/cloud-services/deployments/autoscale-deployments](https://docs.replit.com/cloud-services/deployments/autoscale-deployments)
