const vm = require("node:vm");
const fs = require("fs");
const path = require("path");

const getLog = (param) => {
  return {
    log: function (...params) {
      console.log(`FROM "${param}": `, ...params);
    },
  };
};

const context = {
  x: 2,
  console: getLog("Default"),
  // module,
  process: { env: { test: 123, "Marat.o.o": "Привет" } },
};
vm.createContext(context);

fs.readdirSync(`${__dirname}\\virtual`)
  .filter((file) => path.extname(file) === ".js")
  .forEach((file) => {
    try {
      const data = fs.readFileSync(`${__dirname}\\virtual\\${file}`);
      const loadModule = vm.runInNewContext(data, {
        ...context,
        console: getLog(file),
      });
      if (typeof loadModule === "function") {
        loadModule("Даёшь новые стикеры :)", "ауф!!! ауф!!! ауф!!!");
      }
    } catch (err) {
      getLog(file).log(`ERROR LOAD:`, err);
    }
    console.log(`END FILE ${file}`);
    // vm.runInThisContext(code1)(require);
  });
