if [[ -z "$1" ]]; then 
    read -p "ssh username [root]: " USERNAME
    USERNAME=${USERNAME:-root}
    read -p "host address: " HOST
    echo ${USERNAME}@${HOST}
else
    echo $1
fi

