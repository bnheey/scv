import axios from "axios";
import type { Member } from "../../types/Members";

export const getMembers = async () => {
  const { data } = await axios.get<Member[]>(
    "https://scvclub.ddns.net/members"
  );
  return data;
};
