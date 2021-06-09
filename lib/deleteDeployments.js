"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const githubClient_1 = __importDefault(require("./githubClient"));
exports.default = (repo, environment) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const deployments = yield githubClient_1.default.graphql(`
      query GetDeployments($owner: String!, $repo: String!, $environments: [String!]) {
        repository(owner: $owner, name: $repo) {
          deployments(first: 100, environments: $environments) {
            nodes {
              id
            }
          }
        }
      }`, Object.assign(Object.assign({}, repo), { environments: [environment] }));
    const nodes = (_b = (_a = deployments.repository) === null || _a === void 0 ? void 0 : _a.deployments) === null || _b === void 0 ? void 0 : _b.nodes;
    console.log(JSON.stringify(deployments));
    if (nodes.length <= 0) {
        console.log(`No exiting deployments found for pull request`);
        return;
    }
    for (const node of nodes) {
        console.log(`Deleting existing deployment - ${node.id}`);
        yield githubClient_1.default.graphql(`
          mutation DeleteDeployment($id: ID!) {
            deleteDeployment(input: {id: $id} ) {
              clientMutationId
            }
          }
        `, { id: node.id });
    }
});
