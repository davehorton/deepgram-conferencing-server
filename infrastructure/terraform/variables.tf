variable "region" {
  description = "the aws region in which to create the VPC"
  default = "us-east-1"
}
variable "availability_zone" {
  description = "the availability zone in which to run the jambonz instance"
  default = "us-east-1a"
}
variable "extra_availability_zone" {
  description = "the availability zone in which to run the jambonz instance"
  default = "us-east-1b"
}
variable "vpc_cidr_block" {
  description = "the CIDR block for the whole VPC"
  default = "172.31.0.0/16"
}
variable "subnet_cidr_block" {
  description = "the CIDR for a public subnet within the VPC"
  default = "172.31.32.0/24"
}
variable "extra_subnet_cidr_block" {
  description = "an additional public subnet within the VPC, needed for rds cluster"
  default = "172.31.33.0/24"
}
variable "ec2_instance_type" {
  description = "the EC2 instance type to use for the jambonz server"
  default = "t2.medium"
}
variable "key_name" {
  description = "name of an aws keypair that you have downloaded and wish to use to access the jambonz instance via ssh"
  default = "your-key-here"
}
variable "deepgram_username" {
  description = "your deepgram username"
  default = "replace-with-deepgram-username"
}
variable "deepgram_password" {
  description = "your deepgram password"
  default = "replace-with-deepgram-password"
}
