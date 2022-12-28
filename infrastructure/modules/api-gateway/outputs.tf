output "api_gateway_url" {
  value       = resource.aws_api_gateway_stage.ct_api_gateway_stage.invoke_url
  description = "Invoke URL of the API Gateway"
}
