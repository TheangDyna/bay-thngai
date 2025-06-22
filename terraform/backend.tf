# terraform/backend.tf
terraform {
  backend "s3" {
    bucket         = "terraform-state-bucket-ap-southeast-2-390402568377"
    key            = "baythngai/v-1/terraform.tfstate"
    region         = "ap-southeast-2"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

// 3
