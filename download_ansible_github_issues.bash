#!/bin/bash
for i in `seq 1 624`;
do
    echo page: $i
    curl -u nicluo:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx "https://api.github.com/repos/ansible/ansible/issues?state=all&page=$i" > "issues-$i.json"
    sleep 1
done