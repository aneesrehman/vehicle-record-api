resource "aws_api_gateway_rest_api" "ct" {
  body = templatefile("./modules/api-gateway/openapi/openapi.json", {

    # URIs of lambda functions
    get_vehicles_uri   = "${var.get_vehicles_invoke_arn}"
    create_vehicle_uri = "${var.create_vehicle_invoke_arn}"
    update_vehicle_uri = "${var.update_vehicle_invoke_arn}"
    delete_vehicle_uri = "${var.delete_vehicle_invoke_arn}"
  })

  name = "CT API"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_account" "cloudwatch" {
  cloudwatch_role_arn = aws_iam_role.cloudwatch.arn
}

resource "aws_iam_role" "cloudwatch" {
  name                = "api_gateway_cloudwatch_global"
  managed_policy_arns = ["arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"]
  path                = "/"
  assume_role_policy  = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_api_gateway_deployment" "ct_deployment" {
  rest_api_id = aws_api_gateway_rest_api.ct.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.ct.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_api_gateway_stage" "ct_api_gateway_stage" {
  depends_on = [
    aws_cloudwatch_log_group.logs
  ]
  deployment_id = aws_api_gateway_deployment.ct_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.ct.id
  stage_name    = "ct-test"
}

resource "aws_api_gateway_method_settings" "api_gateway_settings" {
  rest_api_id = aws_api_gateway_rest_api.ct.id
  stage_name  = aws_api_gateway_stage.ct_api_gateway_stage.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled = true
    logging_level   = "INFO"
  }
}

resource "aws_cloudwatch_log_group" "logs" {
  name              = "API-Gateway-Execution-Logs_${aws_api_gateway_rest_api.ct.id}/ct-test"
  retention_in_days = 7
}

resource "aws_lambda_permission" "get_vehicles_api_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.get_vehicles_arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.ct.execution_arn}/*/*"
}

resource "aws_lambda_permission" "create_vehicle_api_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.create_vehicle_arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.ct.execution_arn}/*/*"
}

resource "aws_lambda_permission" "update_vehicle_api_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.update_vehicle_arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.ct.execution_arn}/*/*"
}

resource "aws_lambda_permission" "delete_vehicle_api_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.delete_vehicle_arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.ct.execution_arn}/*/*"
}