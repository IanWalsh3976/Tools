
with open('test1.txt') as data: # Open .txt list of Repo files
    for line in data: # Loop through each row
        with open('test2.txt') as repo:
            if line not in repo.readlines(): # Check for a matching link in the DB list
                print("INSERT INTO #Temp (DocPath) VALUES ("+"'"+line.rstrip()+"'"+")")

# python FileChecker.py > SQL.txt
