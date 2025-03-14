import type { Member } from "@/types/Members";
import { create } from "zustand";

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
