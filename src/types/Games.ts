export type GameMember = {
  memberId: number;
  name: string;
  tier: number;
  tierGap: number;
  duplicate: boolean;
  createdTimestamp?: string;
};

export type Game = {
  gameId: number;
  title: string;
  members: GameMember[];
};
