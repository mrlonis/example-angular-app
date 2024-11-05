#!/bin/bash
force_delete_all_local_branches=${1:-0}
for org_dir in "$HOME"/GitHub/*; do
	echo "Processing GitHub Organization: $org_dir"
	cd "$org_dir" || return

	for project_dir in "$org_dir"/*; do
		if [ -d "$project_dir" ]; then
			echo " "
			echo "Processing Project: $project_dir"
			cd "$project_dir" || return

			default_branch=$(git remote show origin | sed -n '/HEAD branch/s/.*: //p')
			current_branch=$(git rev-parse --abbrev-ref HEAD)
			# Switch back to default branch if not already on it
			if [ "$current_branch" != "$default_branch" ]; then
				git checkout "$default_branch"
			fi

			git fetch -p
			git pull
			if [ -e .gitmodules ]; then
				git submodule update --init --remote --force
			fi

			# If force_delete_all_local_branches is set to 1, delete all local branches that don't have a remote counterpart
			if [ "$force_delete_all_local_branches" -eq 1 ]; then
				local_branches=()
				for branch in $(git for-each-ref --format '%(refname:short)' refs/heads); do
					local_branches+=("$branch")
				done

				remote_branches=()
				for branch in $(git for-each-ref --format '%(refname:short)' refs/remotes/origin); do
					# Trim origin/ from the branch name
					branch=${branch#origin/}
					if [ "$branch" != "HEAD" ]; then
						remote_branches+=("$branch")
					fi
				done

				# Delete local branches not present in remote branches
				for local_branch in "${local_branches[@]}"; do
					exists_in_remote=0
					for remote_branch in "${remote_branches[@]}"; do
						if [ "$local_branch" == "$remote_branch" ]; then
							exists_in_remote=1
							break
						fi
					done
					if [ "$exists_in_remote" -eq 0 ]; then
						git branch -D "$local_branch"
					fi
				done
			else
				# Delete local branches that have been merged into the default branch
				for branch in $(git for-each-ref --format '%(refname) %(upstream:track)' refs/heads | awk '$2 == "[gone]" {sub("refs/heads/", "", $1); print $1}'); do
					git branch -D "$branch"
				done
			fi

			default_branch=""
			current_branch=""
		fi
	done
done
