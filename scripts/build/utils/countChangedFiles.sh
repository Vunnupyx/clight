PATH_FILTER=$1
CHANGED_FILES=$(git diff HEAD HEAD~ --name-only)
MATCH_COUNT=0

for FILE in $CHANGED_FILES
do
    if [[ $FILE == *$PATH_FILTER* ]]; then
        MATCH_COUNT=$(($MATCH_COUNT+1))
    fi
done

echo $MATCH_COUNT