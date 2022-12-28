# code-task-clickdealer

This repository contains the code of the code-task for ClickDealer

## Setup and Provisioning

### Prerequisites

- AWS Account
- [NodeJS](https://nodejs.org/en/download/)
- [Typescript](https://www.typescriptlang.org/download)
- [Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
- [Install AWS Cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [Configuring AWS Credential](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

### Provisioning

This repository has two sub directories `backend` and `infrastructure`. As backend is in `typescript`, it is important to build it before provisioning and deploying it over the infrastructure.

#### Backend

Run the following commands to build the backend

```bash
cd ./backend
npm run build-ts
```

Once the build is successful, now infrastrcuture is ready to be deployed.

#### Infrastructure

```bash
terraform init
terraform apply
```

On running `terraform apply` command, user will be prompted to confirm the changes to be deployed. Once the infrastructure is deployed successfully, Note the API URL against the `api_gateway_url` output.

The API documentation is available on [SwaggerHub](https://app.swaggerhub.com/apis/aneesrehman/vehicle-record/1)
