import { TierOptions } from "../constants/Member";
import { Game, GameMember } from "../types/Games";
import type { Member } from "../types/Members";

/**
 * 게임을 입력 받아 게임에 속한 멤버들을 반환
 * @param games: Game[]
 * @returns [{name: "참가자1", tier: 1, member_id: 1}, {name: "참가자2", tier: 2, member_id: 2}, ...]
 */
export const getGamesToMember = (games: Game[], pinnedIdxs: number[]) => {
  const members = [] as GameMember[];
  const pinnedMembers = {} as { [key: number]: GameMember[] };
  games.map((game, idx) => {
    if (pinnedIdxs.includes(idx)) {
      pinnedMembers[idx] = game.members;
    } else {
      members.push(...game.members);
    }
  });

  return { members, pinnedMembers };
};

/**
 * membersOrGames를 받아 랜덤하게 게임을 생성하여 반환
 * type이 "game"일 경우, membersOrGames는 Game[]이어야 함
 * type이 "game"일 경우, pinnedIdxs를 받아 해당 인덱스에는 고정된 게임을 생성
 * @param membersOrGames : Member[] | Game[]
 * @param type: "member" | "game"
 * @param pinnedIdxs: number[]
 * @returns
 */
export const createGames = (
  membersOrGames: Member[] | Game[],
  type: "member" | "game" = "member",
  pinnedIdxs: number[] = []
) => {
  let filteredMembers = [] as Member[];
  let pinned = {} as { [key: number]: GameMember[] };

  // type 이 game 일 경우, 고정되어있는 게임의 멤버 정보와 나머지 멤버 정보를 분리
  if (type === "game") {
    const { members, pinnedMembers } = getGamesToMember(
      membersOrGames as Game[],
      pinnedIdxs
    );
    filteredMembers = [...members];
    pinned = pinnedMembers;
  } else {
    filteredMembers = [...(membersOrGames as Member[])];
  }

  const getGames = () => {
    const players = [...filteredMembers];
    players.sort(() => Math.random() - 0.5);
    const games = [] as Game[];
    let gameId = 1;

    while (players.length >= 4) {
      const group = players.splice(0, 4);

      const combinations = [
        [
          [group[0], group[1]],
          [group[2], group[3]],
        ],
        [
          [group[0], group[2]],
          [group[1], group[3]],
        ],
        [
          [group[0], group[3]],
          [group[1], group[2]],
        ],
      ];

      let bestCombination = null;
      let minTierGap = Infinity;

      for (const [[team1A, team1B], [team2A, team2B]] of combinations) {
        const team1Sum = team1A.tier + team1B.tier;
        const team2Sum = team2A.tier + team2B.tier;
        const tierGap = Math.abs(team1Sum - team2Sum);

        // 중복 확인
        const isDuplicate =
          new Set([
            team1A.member_id,
            team1B.member_id,
            team2A.member_id,
            team2B.member_id,
          ]).size !== 4;

        if (isDuplicate) {
          return [];
        }
        if (tierGap < minTierGap) {
          minTierGap = tierGap;
          bestCombination = {
            team1: [team1A, team1B],
            team2: [team2A, team2B],
          };
        }
      }

      if (bestCombination) {
        const ids = [
          ...bestCombination.team1.map((member) => member.member_id),
          ...bestCombination.team2.map((member) => member.member_id),
        ];
        const tierGap =
          bestCombination.team1.reduce((acc, member) => acc + member.tier, 0) -
          bestCombination.team2.reduce((acc, member) => acc + member.tier, 0);

        // 게임 추가
        games.push({
          gameId: gameId++,
          title: `game ${gameId - 1}`,
          members: [
            ...bestCombination.team1.map((user) => ({
              ...user,
              tierGap: tierGap > 0 ? tierGap : 0,
              duplicate: ids.filter((id) => id === user.member_id).length > 1,
            })),
            ...bestCombination.team2.map((user) => ({
              ...user,
              tierGap: tierGap < 0 ? -tierGap : 0,
              duplicate: ids.filter((id) => id === user.member_id).length > 1,
            })),
          ],
        });
      }
    }
    return games;
  };

  let games = getGames();
  while (games.length < 1) {
    games = getGames();
  }

  if (pinnedIdxs.length > 0) {
    for (const idx in pinned) {
      games.splice(Number(idx), 0, {
        gameId: 0, // 임시
        title: `game idx`, // 임시
        members: pinned[idx],
      });
    }
    games = games.map((game, idx) => ({
      gameId: idx + 1,
      title: `game ${idx + 1}`,
      members: game.members,
    }));
  }

  return games;
};

/**
 * 중복된 멤버의 아이디를 반환
 * @param members: GameMember[]
 * @returns [12, 21, 2, 4]
 */
export const getDuplicateIds = (members: GameMember[]) => {
  const memberIds = members.map((member) => member.member_id);
  const duplicateIds = memberIds.filter(
    (id, index) => memberIds.indexOf(id) !== index
  );
  return duplicateIds;
};

/**
 * 중복된 멤버를 찾아 duplicate 속성을 추가하여 반환
 * @param members: GameMember[]
 * @returns [{name: "참가자1", tier: 1, member_id: 1, duplicate: false}, {name: "참가자2", tier: 2, member_id: 2, duplicate: true}, ...]
 */
export const getDuplicateMembers = (members: GameMember[]) => {
  const duplicateIds = getDuplicateIds(members);
  return members.map((member) => ({
    ...member,
    duplicate: duplicateIds.includes(member.member_id),
  }));
};

/**
 * 팀별 티어 합을 계산하여 각 멤버에 티어 차이를 추가하여 반환
 * @param members: GameMember[]
 * @returns [{name: "참가자1", tier: 1, member_id: 1, tierGap: 2}, {name: "참가자2", tier: 2, member_id: 2, tierGap: 2}, ...]
 */
export const getTierGapMembers = (members: GameMember[]) => {
  const team1Sum = members[0].tier + members[1].tier;
  const team2Sum = members[2].tier + members[3].tier;

  return members.map((member, index) => ({
    ...member,
    tierGap: index < 2 ? team1Sum - team2Sum : team2Sum - team1Sum,
  }));
};

/**
 * 멤버들을 티어별로 그룹핑하여 반환
 * @param members: Member[]
 * @returns {1: ["참가자1", "참가자2"], 2: ["참가자3", "참가자4"], 3: ["참가자5", "참가자6"]} ...
 */
export const groupedByTier = (members: Member[]) =>
  members.reduce((acc, member) => {
    if (!acc[member.tier]) {
      acc[member.tier] = [];
    }
    acc[member.tier].push(member.name);
    return acc;
  }, {} as { [key: number]: string[] });

/**
 * 멤버들을 티어별로 그룹핑하고, 그룹핑한 티어 정보만 내림차순으로 정렬한 배열을 반환
 * @param members: Member[]
 * @returns [3, 2, 1]
 */
export const sortedTiersDesc = (members: Member[]) => {
  const tieredMembers = groupedByTier(members);
  return Object.keys(tieredMembers)
    .map(Number)
    .sort((a, b) => b - a);
};

/**
 * groupByTier로 그룹핑된 멤버들을 티어별로 표시하는 문자열을 반환
 * @param members: Member[]
 * @param tier: number
 * @returns 마: 참가자1, 참가자2, 참가자3
 */
export const getTierText = (members: Member[], tier: number) => {
  const tieredMembers = groupedByTier(members);
  return `${TierOptions[tier - 1]?.label[0]}: ${[
    ...new Set(tieredMembers[tier]),
  ].join(", ")}`;
};

/**
 * members에는 2회 이상 참여하는 참가자가 존재할 수 있음.
 * 중복이 있는 참가자를 제거한 배열을 반환
 * @param members: Member[]
 * @returns
 */
export const uniqueMembers = (members: Member[]) =>
  members.filter(
    (member, index, self) =>
      index === self.findIndex((m) => m.member_id === member.member_id)
  );
