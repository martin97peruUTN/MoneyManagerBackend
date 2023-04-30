"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
//IMPORTANTE: si uso Typescript, no tengo que poner "type":"modules" en el package.json
//Sino no traspila bien. Igualmente aca tengo que usar la notacion de import de TS
// import authenticateToken from './middleware/JWTAuthentication.js';
// import { loginRoutes } from './routes/login.routes.js';
// import testsRoutes from './routes/tests.routes.js';
// import userRoutes from './routes/user.routes.js';
//import { connectionDB } from './db.js';
const app = (0, express_1.default)();
//Settings
const port = process.env.PORT || 3000;
//Middleware
app.use((0, express_1.urlencoded)({ extended: false }));
app.use((0, express_1.json)());
//All routes starting with /api will be protected
// app.use('/api', authenticateToken)
// //Routes
// app.use(loginRoutes)
// app.use(testsRoutes)
// app.use('/api', userRoutes)
//Not found
//TS no hace falta poner Request y Response explicitamente, son inferidos (poner el mousea arriba y sale)
app.use((req, res) => {
    res.status(404).send({
        message: 'Endpoint not found 🤷‍♂️'
    });
});
app.listen(port, () => {
    console.log(`Listening on port ${port} 😎 🤙`);
});
