terraform {
  backend "s3" {
    bucket         = "terraform-state-bucket-ap-southeast-1-940482428942"
    key            = "iot-dev/terraform.tfstate"
    region         = "ap-southeast-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
