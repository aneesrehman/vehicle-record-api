# Invoke ARNs
variable "get_vehicles_invoke_arn" {
  description = "Invocation ARN of get_vehicles lambda function"
}

variable "create_vehicle_invoke_arn" {
  description = "Invocation ARN of create_vehicle lambda function"
}

variable "update_vehicle_invoke_arn" {
  description = "Invocation ARN of the update_vehicle lambda function"
}

variable "delete_vehicle_invoke_arn" {
  description = "Invocation ARN of the delete_vehicle lambda function"
}

# Function ARNs
variable "get_vehicles_arn" {
  description = "ARN of get_vehicles lambda function"
}

variable "create_vehicle_arn" {
  description = "ARN of create_vehicle lambda function"
}

variable "update_vehicle_arn" {
  description = "ARN of the update_vehicle lambda function"
}

variable "delete_vehicle_arn" {
  description = "ARN of the delete_vehicle lambda function"
}
