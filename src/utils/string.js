export const replaceNbsps = string => {
  if (typeof string === "string" || string instanceof String) {
    const re = new RegExp(String.fromCharCode(160), "g");
    return string.replace(re, " ");
  } else return string;
};
