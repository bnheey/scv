import { Game, GameMember } from "../types/Games";
import type { Member } from "../types/Members";

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

export const createGames = (
  membersOrGames: Member[] | Game[],
  type: "member" | "game" = "member",
  pinnedIdxs: number[] = []
) => {
  let filteredMembers = [] as Member[];
  let pinned = {} as { [key: number]: GameMember[] };

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

  filteredMembers.sort(() => Math.random() - 0.5);

  const games = [];
  let gameId = 1;

  while (filteredMembers.length >= 4) {
    const group = filteredMembers.splice(0, 4);

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

      if (!isDuplicate) {
        if (tierGap < minTierGap) {
          minTierGap = tierGap;
          bestCombination = {
            team1: [team1A, team1B],
            team2: [team2A, team2B],
          };
        }
      }
    }

    // 중복이 없는 조합이 없을 경우, 티어 차이가 가장 적은 조합 선택
    if (!bestCombination) {
      for (const [[team1A, team1B], [team2A, team2B]] of combinations) {
        const team1Sum = team1A.tier + team1B.tier;
        const team2Sum = team2A.tier + team2B.tier;
        const tierGap = Math.abs(team1Sum - team2Sum);

        if (tierGap < minTierGap) {
          minTierGap = tierGap;
          bestCombination = {
            team1: [team1A, team1B],
            team2: [team2A, team2B],
          };
        }
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

  if (pinnedIdxs.length > 0) {
    for (const idx in pinned) {
      games.splice(Number(idx), 0, {
        gameId: gameId++,
        title: `game ${gameId - 1}`,
        members: pinned[idx],
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
