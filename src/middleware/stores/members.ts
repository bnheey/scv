import { create } from "zustand";
import { Member } from "../../types/Members";

interface MemberState {
  members: Member[];
}

interface MemberActions {
  setMembers: (members: Member[]) => void;
}

export const useMembers = create<MemberState & MemberActions>((set) => ({
  members: [],
  setMembers: (members) =>
    set(() => ({
      members: [...members],
    })),
}));
