import type { Member } from "@/types/Members";
import { MEMBER_DATA } from "./mockData";

export const getMembers = async (): Promise<Member[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(MEMBER_DATA);
    }, 1000);
  });
