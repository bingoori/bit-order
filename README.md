react + express + Okex api + firebase 활용
기능 : 회원가입, 로그인, 주문, 조회

초기 셋팅

1. yarn 또는 npm install
2. 터미널 좌우로 두개 키우기
3. 좌측터미널에서 yarn start 또는 npm run start (클라이언트) 실행
4. 우측터미널에서 yarn dev 또는 npm run dev (서버) 실행
5. email 입력 포멧 반드시 맞출 것(validation X)
6. token 필드의 값은 로그인시 자동 셋팅
7. base_time 날짜 포멧 맞출 것(validation X)

ISSUE

1. 최신 eslint 버전과 구버전 node 호환 이슈

- node 업데이트

2. eslint 8.1.0 버전호환 이슈

- eslint 7.11.0로 고정
- react-scripts 4.0.0, 4.0.3로 고정
- 추가 이슈 발생시 @babel/core 7.12.3 설치

3. windows 또는 linux && MAC

- End of Line Sequence (CRLF, LF) 운영체제 따라 달라 js 포멧 작성 불편 (VSCODE 윈도우만 LF로 셋팅할 것)

추가 개발 시
공통 error code 정의
firebase error code 정의
mysql error code 정의

개발모드, 운영모드 env 셋팅
firebase 정보 env 셋팅
mysql 정보 env 셋팅

form validation

클라이언트, 서버, API 정보, DB timezone 정의

공통 API 셋팅 함수 정의
