export const OPTION_TYPES = {
  SUB_COMMAND: [1, "Sub Command"],
  SUB_COMMAND_GROUP: [2, "Sub Command Group"],
  STRING: [3, "String"],
  INTEGER: [4, "Integer"],
  BOOLEAN: [5, "Boolean"],
  USER: [6, "User"],
  CHANNEL: [7, "Channel"],
  ROLE: [8, "Role"],
  MENTIONABLE: [9, "Mentionable"],
  NUMBER: [10, "Number"],
};

export const CHANNEL_TYPES = {
  GUILD_TEXT: [0, "Guild Text"],
  GUILD_VOICE: [2, "Guild Voice"],
  GUILD_CATEGORY: [4, "Guild Category"],
  PUBLIC_THREAD: [11, "Public Thread"],
  PRIVATE_THREAD: [12, "Private Thread"],
  GUILD_FORUM: [15, "Guild Forum"],
  GUILD_DIRECTORY: [14, "Guild Directory"],
  GUILD_STAGE_VOICE: [13, "Guild Stage Voice"],
  GUILD_ANNOUNCEMENT: [5, "Guild Announcement"],
  ANNOUCEMENT_THREAD: [10, "Announcement Thread"],
  DM: [1, "DM"],
  GROUP_DM: [3, "Group DM"],
}

export function oneOf(arr, value) {
  return !!arr.find((v) => v[0] === value);
}