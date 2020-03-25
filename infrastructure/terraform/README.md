# terraform for a deepgram conferencing server

This terraform configuration a single server that runs the Deepgram conferencing application.  In addition to the server itself, this terraform script also creates:

- a VPC that contains all of the infrastructure
- a public subnet in the VPC (including an internet gateway and route table)
- security groups to allow only appropriate traffic
- an Aurora serverless mysql database with the deepgram schema
- a [pm2](https://pm2.io/) ecosystem.config.js file for managing the node.js application

The EC2 instance is based on an AMI that is created from [this packer script](../packer).

## Running the terraform script

Please review and edit the [variables.tf](./variables.tf) file as appropriate.  

Then install the depdencies:
```
terraform init
```

Next, apply the terraform configuration, passing the AWS credentials on the command line:

```
terraform apply -var='key_name=your-aws-ssh-key-name' \
-var='deepgram_username=your-deepgram-username' \
-var='deepgram_password=your-deepgram-password'
```

- `key_name`: an AWS keypair that you have previously created that you will be use to ssh to the instance
- `deepgram_username`: your deepgram username, which is used to authenticate to the transcription service
- `deepgram_password`: your deepgram password, which is used to authenticate to the transcription service
