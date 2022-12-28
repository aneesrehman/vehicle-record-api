# Create dynamoDB tables
module "dynamodb_tables" {
  source = "./modules/dynamodb"
}

# Deploy lambda functions
module "lambda_functions" {
  source              = "./modules/lambda-functions"
  companies_table_arn = module.dynamodb_tables.companies_table_arn
}

module "api_gateway" {
  source = "./modules/api-gateway"

  # Invoke ARNs
  get_vehicles_invoke_arn   = module.lambda_functions.get_vehicles_invoke_arn
  create_vehicle_invoke_arn = module.lambda_functions.create_vehicle_invoke_arn
  update_vehicle_invoke_arn = module.lambda_functions.update_vehicle_invoke_arn
  delete_vehicle_invoke_arn = module.lambda_functions.delete_vehicle_invoke_arn

  # Function ARNs
  get_vehicles_arn   = module.lambda_functions.get_vehicles_arn
  create_vehicle_arn = module.lambda_functions.create_vehicle_arn
  update_vehicle_arn = module.lambda_functions.update_vehicle_arn
  delete_vehicle_arn = module.lambda_functions.delete_vehicle_arn
}
