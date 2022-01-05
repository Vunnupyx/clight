if [[ -z "$1" ]]; then 
    read -p "ssh username: " USERNAME
    read -p "host address: " HOST
    echo ${USERNAME}@${HOST}
else
    echo $1
fi

