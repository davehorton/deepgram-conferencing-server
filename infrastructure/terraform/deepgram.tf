provider "aws" {
  profile    = "default"
  region     = var.region
}

# create a VPC with a public subnet
resource "aws_vpc" "deepgram" {
  cidr_block = var.vpc_cidr_block

  tags = {
    Name = "deepgram"
  }
}

resource "aws_internet_gateway" "deepgram" {
  vpc_id = aws_vpc.deepgram.id

  tags = {
    Name = "deepgram"
  }
}

resource "aws_default_route_table" "deepgram" {
   default_route_table_id = aws_vpc.deepgram.default_route_table_id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.deepgram.id
  }

  tags = {
    Name = "deepgram default route table"
  }
}

resource "aws_subnet" "deepgram" {
  vpc_id            = aws_vpc.deepgram.id
  cidr_block        = var.subnet_cidr_block
  availability_zone = var.availability_zone

  tags = {
    Name = "deepgram"
  }
}

resource "aws_subnet" "deepgram-extra" {
  vpc_id            = aws_vpc.deepgram.id
  cidr_block        = var.extra_subnet_cidr_block
  availability_zone = var.extra_availability_zone

  tags = {
    Name = "deepgram"
  }
}

# create a security group that allows any server in the VPC to access aurora
resource "aws_security_group" "allow_mysql" {
  name        = "allow_mysql"
  description = "Allow mysl connections"
  vpc_id      = aws_vpc.deepgram.id

  ingress {
    description = "mysql from VPC"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.deepgram.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_mysql"
  }
}

# create a security group to allow sip/rtp/http 
resource "aws_security_group" "allow_deepgram" {
  name        = "allow_deepgram"
  description = "Allow traffic needed for deepgram"
  vpc_id      = aws_vpc.deepgram.id

  ingress {
    description = "ssh"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "sip from everywhere"
    from_port   = 5060
    to_port     = 5060
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "sip from everywhere"
    from_port   = 5060
    to_port     = 5060
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "rtp from everywhere"
    from_port   = 25000
    to_port     = 39000
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "http"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_deepgram"
  }
}

# create a subnet group for mysql
resource "aws_db_subnet_group" "deepgram" {
  name       = "deepgram-mysql-subnet"
  subnet_ids = [aws_subnet.deepgram.id, aws_subnet.deepgram-extra.id]
}

# create aurora database
resource "aws_rds_cluster" "deepgram" {
  cluster_identifier      = "aurora-cluster-deepgram"
  engine                  = "aurora"
  engine_version          = "5.6.10a"
  engine_mode             = "serverless"
  vpc_security_group_ids  = [aws_security_group.allow_mysql.id]
  db_subnet_group_name    = aws_db_subnet_group.deepgram.name
  database_name           = "deepgram"
  master_username         = "admin"
  master_password         = "deepgramR0ck$"
  skip_final_snapshot     = true
  backup_retention_period = 5
  preferred_backup_window = "07:00-09:00"

  scaling_configuration {
    auto_pause               = true
    min_capacity             = 1
    max_capacity             = 1
    seconds_until_auto_pause = 300
  }
}

# select the most recent deepgram AMI
data "aws_ami" "deepgram" {
  most_recent      = true
  name_regex       = "^deepgram-conferencing-server"
  owners           = ["376029039784"]
}

# create the EC2 instance that will run deepgram
resource "aws_instance" "deepgram" {
  ami                    = data.aws_ami.deepgram.id
  instance_type          = var.ec2_instance_type
  associate_public_ip_address = true
  subnet_id              = aws_subnet.deepgram.id
  vpc_security_group_ids = [aws_security_group.allow_deepgram.id]
  user_data              = templatefile("${path.module}/ecosystem.config.js.tmpl", {
    DEEPGRAM_USERNAME       = var.deepgram_username
    DEEPGRAM_PASSWORD       = var.deepgram_password
    DEEPGRAM_MYSQL_HOST     = aws_rds_cluster.deepgram.endpoint
    DEEPGRAM_MYSQL_USER     = aws_rds_cluster.deepgram.master_username
    DEEPGRAM_MYSQL_PASSWORD = aws_rds_cluster.deepgram.master_password
  })
  key_name               = var.key_name
  monitoring             = true

  # create the database tables
  provisioner "remote-exec" {
    inline = [
      "mysql -h ${aws_rds_cluster.deepgram.endpoint} -u admin -D deepgram -pdeepgramR0ck$ < /home/admin/apps/deepgram-conferencing-server/db/schema.sql",
    ]

    connection {
      type      = "ssh"
      user      = "admin"
      host      = self.public_ip
    }
  }

  depends_on = [aws_internet_gateway.deepgram, aws_rds_cluster.deepgram]

  tags = {
    Name = "deepgram"  
  }
}
