library(rmongodb)
library(rjson)

mongo = mongo.create(host = "localhost")
mongo.is.connected(mongo)

mongo.get.databases(mongo)
mongo.get.database.collections(mongo, db = "analytics")

DBNS = "analytics.GWPH"
x <- mongo.count(mongo, ns = DBNS)
print(x)

cursor <- mongo.find(mongo, ns = DBNS)
GWPH = data.frame(stringsAsFactors = FALSE)

i = 0
## iterate over the cursor
while (mongo.cursor.next(cursor)) {
  # iterate and grab the next record
  tmp = mongo.bson.to.list(mongo.cursor.value(cursor))
  
  listOfStatuses <- tmp$statuses
 
  for (i in listOfStatuses) {
    print(i$text)
  }
      
}
