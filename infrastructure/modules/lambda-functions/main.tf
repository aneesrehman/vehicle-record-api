variable "prefix" {
  default = "ct" # code-task
}

variable "env" {
  default = "test"
}

# Defining lambda layer for node_modules
module "lambda_layer_node_modules" {
  source = "terraform-aws-modules/lambda/aws"

  create_layer = true

  layer_name = "node-modules"
  source_path = "../backend/node-modules-layer"
  compatible_runtimes = ["nodejs16.x"]
}

# Defining lambda layer for common
module "lambda_layer_common" {
  source = "terraform-aws-modules/lambda/aws"

  create_layer = true

  layer_name = "common"
  source_path = "../backend/common-layer"
  compatible_runtimes = ["nodejs16.x"]
}


# Add item lambda function
module "get_vehicles" {
  source        = "terraform-aws-modules/lambda/aws"
  function_name = "${var.prefix}-get-vehicles-${var.env}"
  handler       = "app.lambdaHandler"
  description   = "Lambda function to create vehicle record"
  source_path   = "../backend/dist/lambda/record-management/get/"
  runtime       = "nodejs16.x"

  # Attaching layers
  layers = [
    module.lambda_layer_node_modules.lambda_layer_arn,
    module.lambda_layer_common.lambda_layer_arn
  ]

  # Policy
  attach_policy_json = true
  policy_json = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:Scan"
        ],
        "Resource" : [
          "${var.companies_table_arn}"
        ]
      }
    ]
  })
}

# Add item lambda function
module "create_vehicle" {
  source        = "terraform-aws-modules/lambda/aws"
  function_name = "${var.prefix}-create-vehicle-${var.env}"
  handler       = "app.lambdaHandler"
  description   = "Lambda function to create vehicle record"
  source_path   = "../backend/dist/lambda/record-management/create/"
  runtime       = "nodejs16.x"

  # Attaching layers
  layers = [
    module.lambda_layer_node_modules.lambda_layer_arn,
    module.lambda_layer_common.lambda_layer_arn
  ]

  # Policy
  attach_policy_json = true
  policy_json = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:PutItem"
        ],
        "Resource" : [
          "${var.companies_table_arn}"
        ]
      }
    ]
  })
}

module "update_vehicle" {
  source        = "terraform-aws-modules/lambda/aws"
  function_name = "${var.prefix}-update-vehicle-${var.env}"
  handler       = "app.lambdaHandler"
  description   = "Lambda function to create vehicle record"
  source_path   = "../backend/dist/lambda/record-management/update/"
  runtime       = "nodejs16.x"

  # Attaching layers
  layers = [
    module.lambda_layer_node_modules.lambda_layer_arn,
    module.lambda_layer_common.lambda_layer_arn
  ]

  # Policy
  attach_policy_json = true
  policy_json = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:GetItem",
          "dynamodb:UpdateItem"
        ],
        "Resource" : [
          "${var.companies_table_arn}"
        ]
      }
    ]
  })
}

module "delete_vehicle" {
  source        = "terraform-aws-modules/lambda/aws"
  function_name = "${var.prefix}-delete-vehicle-${var.env}"
  handler       = "app.lambdaHandler"
  description   = "Lambda function to create vehicle record"
  source_path   = "../backend/dist/lambda/record-management/delete/"
  runtime       = "nodejs16.x"

  # Attaching layers
  layers = [
    module.lambda_layer_node_modules.lambda_layer_arn,
    module.lambda_layer_common.lambda_layer_arn
  ]

  # Policy
  attach_policy_json = true
  policy_json = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:DeleteItem"
        ],
        "Resource" : [
          "${var.companies_table_arn}"
        ]
      }
    ]
  })
}