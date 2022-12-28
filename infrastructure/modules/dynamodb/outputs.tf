output "companies_table_arn" {
  value = module.companies_table.dynamodb_table_arn
  description = "Companies table ARN"
}