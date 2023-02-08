docker manifest inspect $1 > /dev/null;

if [[ $? -eq "0" ]]; then
    echo true
else
    echo false
fi