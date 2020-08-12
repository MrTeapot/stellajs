export const WorldSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 6,
    },
  },
  required: ["name"],
};
