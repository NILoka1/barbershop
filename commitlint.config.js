const { readdirSync } = require("fs");
const { join } = require("path");

const getPackageScopes = () => {
  const packagesPath = join(__dirname, "packages");
  try {
    return [
      "root",
      ...readdirSync(packagesPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name),
    ];
  } catch (e) {
    return ["root"];
  }
};

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-empty": [2, "never"],
    "scope-enum": [2, "always", getPackageScopes()],
  },
};
