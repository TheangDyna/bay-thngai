# --- VPC Module ---
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name               = var.project_name
  cidr               = "10.0.0.0/16"
  azs                = ["${var.aws_region}a", "${var.aws_region}b"]
  public_subnets     = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets    = []
  enable_nat_gateway = false
  single_nat_gateway = false
}

# resource "aws_security_group" "vpce_sg" {
#   name   = "${var.project_name}-vpce-sg"
#   vpc_id = module.vpc.vpc_id
#   ingress {
#     from_port   = 443
#     to_port     = 443
#     protocol    = "tcp"
#     cidr_blocks = [module.vpc.vpc_cidr_block]
#   }
#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# }

# resource "aws_vpc_endpoint" "cognito_idp" {
#   vpc_id             = module.vpc.vpc_id
#   service_name       = "com.amazonaws.${var.aws_region}.cognito-idp"
#   vpc_endpoint_type  = "Interface"
#   subnet_ids         = module.vpc.public_subnets
#   security_group_ids = [aws_security_group.vpce_sg.id]
# }

# resource "aws_vpc_endpoint" "s3" {
#   vpc_id            = module.vpc.vpc_id
#   service_name      = "com.amazonaws.${var.aws_region}.s3"
#   vpc_endpoint_type = "Gateway"
#   route_table_ids   = module.vpc.public_route_table_ids
# }

# resource "aws_vpc_endpoint" "dynamodb" {
#   vpc_id            = module.vpc.vpc_id
#   service_name      = "com.amazonaws.${var.aws_region}.dynamodb"
#   vpc_endpoint_type = "Gateway"
#   route_table_ids   = module.vpc.public_route_table_ids
# }
