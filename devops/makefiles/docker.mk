login:
	./devops/scripts/docker.sh script_login
build_image:
	./devops/scripts/docker.sh script_build
deploy_image:
	./devops/scripts/docker.sh script_deploy
lint:
	./devops/scripts/docker.sh script_lint