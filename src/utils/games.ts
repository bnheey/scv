import { TierOptions } from "@/constants/Member";
import type { Game, GameMember } from "@/types/Games";
import type { Member } from "@/types/Members";
import { isFreshMember } from "./shared";

/**
 * 게임을 입력 받아 게임에 속한 멤버들을 반환
 * @param games: Game[]
 * @returns [{name: "참가자1", tier: 1, memberId: 1}, {name: "참가자2", tier: 2, memberId: 2}, ...]
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
 * @param inputGameData : Member[] | Game[]
 * @param type: "member" | "game"
 * @param pinnedIdxs: number[]
 * @returns
 */
export const createGames = (
  inputGameData: Member[] | Game[],
  type: "member" | "game" = "member",
  pinnedIdxs: number[] = []
) => {
  if (inputGameData.length === 0) {
    return [];
  }

  let filteredMembers = [] as Member[];
  let pinned = {} as { [key: number]: GameMember[] };

  // type 이 game 일 경우, 고정되어있는 게임의 멤버 정보와 나머지 멤버 정보를 분리
  if (type === "game") {
    const { members, pinnedMembers } = getGamesToMember(
      inputGameData as Game[],
      pinnedIdxs
    );
    filteredMembers = [...members];
    pinned = pinnedMembers;
  } else {
    filteredMembers = [...(inputGameData as Member[])];
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
            team1A.memberId,
            team1B.memberId,
            team2A.memberId,
            team2B.memberId,
          ]).size !== 4;

        if (isDuplicate && filteredMembers.length > 4) {
          // filteredMembers가 4명 이하인 경우 예외적으로 중복 허용
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
          ...bestCombination.team1.map((member) => member.memberId),
          ...bestCombination.team2.map((member) => member.memberId),
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
              duplicate: ids.filter((id) => id === user.memberId).length > 1,
            })),
            ...bestCombination.team2.map((user) => ({
              ...user,
              tierGap: tierGap < 0 ? -tierGap : 0,
              duplicate: ids.filter((id) => id === user.memberId).length > 1,
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
  const memberIds = members.map((member) => member.memberId);
  const duplicateIds = memberIds.filter(
    (id, index) => memberIds.indexOf(id) !== index
  );
  return duplicateIds;
};

/**
 * 중복된 멤버를 찾아 duplicate 속성을 추가하여 반환
 * @param members: GameMember[]
 * @returns [{name: "참가자1", tier: 1, memberId: 1, duplicate: false}, {name: "참가자2", tier: 2, memberId: 2, duplicate: true}, ...]
 */
export const getDuplicateMembers = (members: GameMember[]) => {
  const duplicateIds = getDuplicateIds(members);
  return members.map((member) => ({
    ...member,
    duplicate: duplicateIds.includes(member.memberId),
  }));
};

/**
 * 팀별 티어 합을 계산하여 각 멤버에 티어 차이를 추가하여 반환
 * @param members: GameMember[]
 * @returns [{name: "참가자1", tier: 1, memberId: 1, tierGap: 2}, {name: "참가자2", tier: 2, memberId: 2, tierGap: 2}, ...]
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
    acc[member.tier].push(getMemberName(member.name, member.createdTimestamp));
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
  ].join(" ")}`;
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
      index === self.findIndex((m) => m.memberId === member.memberId)
  );

/**
 * 멤버 이름을 받아, 30일 이내에 생성된 멤버인 경우 이름 뒤에 🐣를 붙여 반환
 * sliceIdx를 통해 이름을 잘라낼 수 있음
 * @param name: string
 * @param createdTimestamp: string
 * @param sliceIdx: number
 * @returns
 */
export const getMemberName = (
  name: string,
  createdTimestamp: string = "",
  sliceIdx: number = 0,
  useFresh: boolean = true,
  useGuest: boolean = true
) => {
  const isFresh = createdTimestamp && isFreshMember(createdTimestamp);
  const isGuest = !createdTimestamp;
  const formattedName = name.replace(/\s+/g, "").replace(/\(.*?\)/g, "");
  if (isGuest && useGuest) return `${formattedName}(게스트)`;
  if (isFresh && useFresh) return `${formattedName.slice(sliceIdx)}🐣`;
  return formattedName;
};

/**
 * 배열의 startIndex와 endIndex를 받아, 해당 인덱스의 요소를 교체한 배열을 반환
 * @param member
 * @param startIndex
 * @param endIndex
 * @returns
 */
export const reorderArray = <T>(
  member: T[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(member);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * 게임을 입력 받아 게임을 교체한 배열을 반환(동일 게임 내)
 * @example
 * 1경기에 [참가자1, 참가자2, 참가자3, 참가자4]가 있을 때,
 * 참가자1과 참가자3을 교체하면 [참가자3, 참가자2, 참가자1, 참가자4]가 반환
 * @param games
 * @param gameIndex
 * @param sourceIndex
 * @param destinationIndex
 * @returns
 */
export const updatePlayerOrder = (
  games: Game[],
  gameIndex: number,
  sourceIndex: number,
  destinationIndex: number
): Game[] => {
  const newGames = Array.from(games);
  const game = newGames[gameIndex];
  const newMembers = reorderArray(game.members, sourceIndex, destinationIndex);
  game.members = getTierGapMembers(getDuplicateMembers(newMembers));
  return newGames;
};

/**
 * 게임을 입력 받아 게임을 교체한 배열을 반환(다른 게임 간)
 * @example
 * 1경기에 [참가자1, 참가자2, 참가자3, 참가자4]
 * 2경기에 [참가자5, 참가자6, 참가자7, 참가자8]가 있을 때,
 * 참가자1과 참가자5을 교체하면
 * 1경기: [참가자2, 참가자5, 참가자3, 참가자4]
 * 2경기: [참가자1, 참가자6, 참가자7, 참가자8]
 * @param games
 * @param sourceGameIndex
 * @param destinationGameIndex
 * @param sourceIndex
 * @param destinationIndex
 * @returns
 */
export const updatePlayerOrderWithGames = (
  games: Game[],
  sourceGameIndex: number,
  destinationGameIndex: number,
  sourceIndex: number,
  destinationIndex: number
): Game[] => {
  const newGames = Array.from(games);
  const sourceGame = newGames[sourceGameIndex];
  const destinationGame = newGames[destinationGameIndex];

  const sourceMembers = Array.from(sourceGame.members);
  const destinationMembers = Array.from(destinationGame.members);

  const [movedMember] = sourceMembers.splice(sourceIndex, 1);
  const [targetMember] = destinationMembers.splice(destinationIndex, 1);

  sourceMembers.splice(sourceIndex, 0, targetMember);
  destinationMembers.splice(destinationIndex, 0, movedMember);

  sourceGame.members = getTierGapMembers(getDuplicateMembers(sourceMembers));
  destinationGame.members = getTierGapMembers(
    getDuplicateMembers(destinationMembers)
  );

  return newGames;
};
