import csv
import json

# set file paths
csvFilePath = "./data/seasonData.csv"
jsonFilePath = "./data/seasonData.json"

# initialize data element
data = [] 

# open CSV file and read data
with open(csvFilePath,'r') as csvf: 
    csvReader = csv.DictReader(csvf)

    # for each row, add it to the data array
    for rows in csvReader:
        data.append(rows)

# write the data array to a JSON file
with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
    jsonf.write(json.dumps(data, indent=4)) 
