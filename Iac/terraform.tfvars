aws_region         = "eu-north-1"
vpc_cidr_block     = "10.0.0.0/16"
public_subnet_cidr = ["10.0.1.0/24", "10.0.2.0/24"]
availability_zones = ["eu-north-1a", "eu-north-1b"]

ami_id    = "ami-02fda57d7882770d8"
instance_type          = "t3.micro"
key_name               = "FTubuntu-k"
vpc_name      = "skilledhub"
