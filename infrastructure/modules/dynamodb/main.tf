variable "prefix" {
  default = "ct"
}

variable "env" {
  default = "test"
}

module "companies_table" {
  source = "terraform-aws-modules/dynamodb-table/aws"

  name = "vehicles"
  hash_key = "id"

  attributes = [
    {
      name = "id"
      type = "S"
    }
  ]
}