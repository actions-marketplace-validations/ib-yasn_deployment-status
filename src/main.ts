import * as core from "@actions/core";
import * as github from "@actions/github";
import deactivateDeployments from "./deactivateDeployments";
import deleteDeployments from "./deleteDeployments";
import githubClient from './githubClient';

type DeploymentState =
  | "error"
  | "failure"
  | "inactive"
  | "in_progress"
  | "queued"
  | "pending"
  | "success";

async function run() {
  try {
    const context = github.context;
    const defaultUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}/checks`;

    const url = core.getInput("target_url", { required: false }) || defaultUrl;
    const description = core.getInput("description", { required: false }) || "";
    const deploymentId = core.getInput("deployment_id", { required: false });
    const environment =
    core.getInput("environment", { required: false }) || "production";
    const environmentUrl =
      core.getInput("environment_url", { required: false }) || "";
    const state = core.getInput("state") as DeploymentState;
    const deleteEnvironment = core.getInput("delete_environment", { required: false }) === "true";


    if(deploymentId) {
      await githubClient.repos.createDeploymentStatus({
        ...context.repo,
        deployment_id: parseInt(deploymentId),
        state,
        log_url: defaultUrl,
        target_url: url,
        description,
        environment_url: environmentUrl,
      });
    }
    if(deleteEnvironment) {
      await deactivateDeployments(context.repo, environment);
      await deleteDeployments(context.repo, environment);
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
