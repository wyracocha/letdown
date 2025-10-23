init:
	./devops/scripts/infra.sh script_terraform_init
plan:
	./devops/scripts/infra.sh script_terraform_plan
apply:
	./devops/scripts/infra.sh script_terraform_apply
destroy:
	./devops/scripts/infra.sh script_terraform_destroy
output:
	./devops/scripts/infra.sh script_terraform_output
doc:
	./devops/scripts/infra.sh script_terraform_doc