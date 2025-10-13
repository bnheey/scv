import { formatDate, getDayName, getGameTime } from "@/utils/date";

export const formPasteText = {
  attendance: `SCV🏸 ☆ (${getDayName(new Date())}) ${getGameTime()}
코트번호 : 1번

콕 남 3개, 여 2개
<참석명단>
1.
2.
3.
4.
5.
6.
7.
8.
9.
10.
11.
12.
13.
14.
15.
16.`,
  wait: `🏃‍♂참석 대기‼(${formatDate(new Date(), "D일")} ${getDayName(
    new Date(),
    "long"
  )})
모임시간 한시간 전 취소자 미발생시
1. 면제권 사용
2. 마감참석 벌금
3. 불참
(괄호안에 번호 기입)

1.
2.
3.`,
  purchase: `🏸셔틀콕
ⓘ 회원분들의 편의를 위해 미리 구매 후 실비로 판매합니다.
닉텐블랙(2.5) - 현장 구매(이현석)
▶[3333-33-8272371 카카오뱅크]

🏸거트
미소스포츠(1.5) - 성영돈
▶[sc제일 408-20-291454]`,
};
