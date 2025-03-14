import type { Member } from "@/types/Members";
import axios from "axios";

export const getMembers = async () => {
  const { data } = await axios.get<Member[]>(
    "https://scvclub.ddns.net/members"
  );
  return data;
};
