export type GameMember = {
  member_id: number;
  name: string;
  tier: number;
  tierGap: number;
  duplicate: boolean;
};

export type Game = {
  gameId: number;
  title: string;
  members: GameMember[];
};
