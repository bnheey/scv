import { GameMember } from "../types/Games";

export const createGames = (
  users: { member_id: number; name: string; tier: number }[]
) => {
  users = [...users];
  users.sort(() => Math.random() - 0.5);

  const games = [];
  let gameId = 1;

  while (users.length >= 4) {
    const group = users.splice(0, 4);

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
      const tierGap = team1Sum - team2Sum;

      if (tierGap === 0) {
        bestCombination = { team1: [team1A, team1B], team2: [team2A, team2B] };
        minTierGap = tierGap;
        break;
      }
      // 티어 차이가 동일한 게임이 없는 경우 차이가 가장 적은 조합 선택
      if (tierGap < minTierGap) {
        minTierGap = tierGap;
        bestCombination = { team1: [team1A, team1B], team2: [team2A, team2B] };
      }
    }

    if (bestCombination) {
      const ids = [
        ...bestCombination.team1.map((member) => member.member_id),
        ...bestCombination.team2.map((member) => member.member_id),
      ];

      // 게임 추가
      games.push({
        gameId: gameId++,
        title: `game ${gameId - 1}`,
        members: [
          ...bestCombination.team1.map((user) => ({
            ...user,
            tierGap: minTierGap > 0 ? minTierGap : 0,
            duplicate: ids.filter((id) => id === user.member_id).length > 1,
          })),
          ...bestCombination.team2.map((user) => ({
            ...user,
            tierGap: minTierGap < 0 ? -minTierGap : 0,
            duplicate: ids.filter((id) => id === user.member_id).length > 1,
          })),
        ],
      });
    }
  }

  return games;
};

export const getDuplicateIds = (members: GameMember[]) => {
  const memberIds = members.map((member) => member.member_id);
  const duplicateIds = memberIds.filter(
    (id, index) => memberIds.indexOf(id) !== index
  );
  return duplicateIds;
};

export const getDuplicateMembers = (members: GameMember[]) => {
  const duplicateIds = getDuplicateIds(members);
  return members.map((member) => ({
    ...member,
    duplicate: duplicateIds.includes(member.member_id),
  }));
};

export const getTierGapMembers = (members: GameMember[]) => {
  const team1Sum = members[0].tier + members[1].tier;
  const team2Sum = members[2].tier + members[3].tier;

  return members.map((member, index) => ({
    ...member,
    tierGap: index < 2 ? team1Sum - team2Sum : team2Sum - team1Sum,
  }));
};
