# Invocation ARNS
output "get_vehicles_invoke_arn" {
  value       = module.get_vehicles.lambda_function_invoke_arn
  description = "Invocation ARN of get_vehicles lambda function"
}

output "create_vehicle_invoke_arn" {
  value       = module.create_vehicle.lambda_function_invoke_arn
  description = "Invocation ARN of create_vehicle lambda function"
}

output "update_vehicle_invoke_arn" {
  value       = module.update_vehicle.lambda_function_invoke_arn
  description = "Invocation ARN of the update_vehicle lambda function"
}

output "delete_vehicle_invoke_arn" {
  value       = module.delete_vehicle.lambda_function_invoke_arn
  description = "Invocation ARN of the delete_vehicle lambda function"
}

# Function ARNs
output "get_vehicles_arn" {
  value       = module.get_vehicles.lambda_function_arn
  description = "ARN of get_vehicles lambda function"
}

output "create_vehicle_arn" {
  value       = module.create_vehicle.lambda_function_arn
  description = "ARN of create_vehicle lambda function"
}

output "update_vehicle_arn" {
  value       = module.update_vehicle.lambda_function_arn
  description = "ARN of update_vehicle lambda function"
}

output "delete_vehicle_arn" {
  value       = module.delete_vehicle.lambda_function_arn
  description = "ARN of delete_vehicle lambda function"
}
