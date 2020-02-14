"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const micro_1 = require("micro");
const microrouter_1 = require("microrouter");
const getPizza = async () => ':pizza:';
const server = new http_1.Server(micro_1.default(microrouter_1.router(microrouter_1.get('/pizza', getPizza))));
server.listen(3000);
//# sourceMappingURL=index.js.map