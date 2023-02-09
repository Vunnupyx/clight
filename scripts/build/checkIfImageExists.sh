registry=mdclightdev
repository=$1
tag=$2

availableTags=$(az acr repository show-tags --name $registry --repository $repository -o tsv)

while IFS=';' read -ra ADDR; do
  for i in "${ADDR[@]}"; do
    if [ "$i" == "$tag" ]; then
        echo true
        exit 0
    fi
  done
done <<< "$availableTags"

echo false
