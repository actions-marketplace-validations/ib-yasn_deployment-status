# deployment-status

A GitHub action to update the status of [Deployments](https://developer.github.com/v3/repos/deployments/) as part of your GitHub CI workflows.

Works great with my other action to create Deployments, [chrnorm/deployment-action](https://github.com/chrnorm/deployment-action).

## Action inputs

| name              | description                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `state`           | The state to set the deployment to. Must be one of the below: "error" "failure" "inactive" "in_progress" "queued" "pending" "success" |
| `deployment_id`      | (Optional) The id of the deployment. Can be omitted in case of delation                                                         |
| `target_url`      | (Optional) The target URL. This should be the URL of the app once deployed                                                            |
| `description`     | (Optional) Descriptive message about the deployment                                                                                   |
| `environment_url` | (Optional) Sets the URL for accessing your environment                                                                                |
| `delete_environment`   | (Optional a flag to delete the deployment environemt)                                                                            |


## Required Enrivonment variables

| name            | description                                            |
| --------------- | ------------------------------------------------------ |
| `GITHUB_TOKEN` | GitHub token |

## Usage example

The below example includes `chrnorm/deployment-action` and `chrnorm/deployment-status` to create and update a deployment within a workflow.


```yaml
name: Deploy

on: [push]

jobs:
  deploy:
    name: Deploy my app

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - uses: ib-yasn/deployment-action@v1
        name: Create GitHub deployment
        id: deployment
        with:
          target_url: http://my-app-url.com
          environment: staging
        env:
          GITHUB_TOKEN: "${{ github.token }}"
      - name: Deploy my app
        run: |
          # add your deployment code here
      - name: Update deployment status (success)
        if: success()
        uses: ib-yasn/deployment-status@v1
        with:
          target_url: http://my-app-url.com
          state: "success"
          environment: staging
          deployment_id: ${{ steps.deployment.outputs.deployment_id }}
        env:
          GITHUB_TOKEN: "${{ github.token }}"
          
      - name: Update deployment status (failure)
        if: failure()
        uses: ib-yasn/deployment-status@v1
        with:
          target_url: http://my-app-url.com
          state: "failure"
          environment: staging
          deployment_id: ${{ steps.deployment.outputs.deployment_id }}
        env:
          GITHUB_TOKEN: "${{ github.token }}"
         
```
## Delete an environment

```yaml
name: Deploy

on: [push]

jobs:
  deploy:
    name: Deploy my app

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - uses: ib-yasn/deployment-status@v1
        name: Create GitHub deployment
        id: deployment
        with:
          state: "inactive"
          target_url: http://my-app-url.com
          environment: staging
          delete_environemt: true
        env:
          GITHUB_TOKEN: "${{ github.token }}"
