# dynamodb.tf
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST" # Cost-effective for low usage
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S" # String type for LockID
  }

  tags = {
    Name        = "${var.project_name}-terraform-locks"
    Project     = var.project_name
    Environment = var.environment
  }
}
