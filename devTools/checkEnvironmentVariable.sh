if [[ -z "$1" ]]; then 
    read -p "ssh username [root]: " USERNAME
    USERNAME=${USERNAME:-root}
else
    USERNAME=${1}
fi
read -p "$USERNAME host address: " HOST
echo ${USERNAME}@${HOST}

