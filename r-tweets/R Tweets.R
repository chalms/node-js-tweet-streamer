library(rmongodb)
library(rjson)
library(bitops)
library(RCurl)
library(plyr)

# Function that trims the unncessary information
frameBeautifier <- function(df) {
  df <- df[ , -grep("search_metadata", colnames(df))]
  df <- df[ , -grep("entities", colnames(df))]
  df <- df[ , -grep("lang", colnames(df))]
  df <- df[ , -grep("metadata", colnames(df))]
  df <- df[ , -grep("statuses.\\d.id$", colnames(df), perl=TRUE)]
  df <- df[ , -grep("statuses.\\d.user.(?!screen_name)", colnames(df), perl=TRUE)]
  df <- df[ , -grep("retweeted", colnames(df))]
  df <- df[ , -grep("favorite_count", colnames(df))]
  df <- df[ , -grep("retweet_count", colnames(df))]
  df <- df[ , -grep("possibly_sensitive", colnames(df))]

  df <- df[!duplicated(df),]

  df <- t(df)
  df <- as.data.frame(df)

  created_at = as.data.frame(df[grepl("*created_at*", rownames(df)),])
  id_str = as.data.frame(df[grepl("*id_str*", rownames(df)),])
  screen_name = as.data.frame(df[grepl("*user.screen_name*", rownames(df)),])
  text = as.data.frame(df[grepl("*text*", rownames(df)),])
  favorited = as.data.frame(df[grepl("*favorited*", rownames(df)),])
  truncated = as.data.frame(df[grepl("*truncated*", rownames(df)),])
  tweet_source = as.data.frame(df[grepl("*source*", rownames(df)),])

  row.names(created_at) = 1:nrow(created_at)
  colnames(created_at) = c("created")
  row.names(id_str) = 1:nrow(id_str)
  colnames(id_str) = c("id")
  row.names(screen_name) = 1:nrow(screen_name)
  colnames(screen_name) = c("screenName")
  row.names(text) = 1:nrow(text)
  colnames(text) = c("text")
  row.names(favorited) = 1:nrow(favorited)
  colnames(favorited) = c("favorited")
  row.names(truncated) = 1:nrow(truncated)
  colnames(truncated) = c("truncated")
  row.names(tweet_source) = 1:nrow(tweet_source)
  colnames(tweet_source) = c("statusSource")

  created_at = cbind(no = 1:nrow(created_at), created_at)
  id_str = cbind(no = 1:nrow(id_str), id_str)
  screen_name = cbind(no = 1:nrow(screen_name), screen_name)
  text = cbind(no = 1:nrow(text), text)
  favorited = cbind(no = 1:nrow(favorited), favorited)
  truncated = cbind(no = 1:nrow(truncated), truncated)
  tweet_source = cbind(no = 1:nrow(tweet_source), tweet_source)

  master = merge(text, favorited, "no")
  master[,c("replyToSN")] <- NA
  master = merge(master, created_at, "no")
  master = merge(master, truncated, "no")
  master[,c("replyToSID")] <- NA
  master = merge(master, id_str, "no")
  master[,c("replyToUID")] <- NA
  master = merge(master, tweet_source, "no")
  master = merge(master, screen_name, "no")
  master[,c("to","rt")] <- NA
  master
}

serverHost <<- "http://limitless-wildwood-6059.herokuapp.com/query.json"
max_id <<- 0
min_id <<- 0
host <<-"ds053469.mongolab.com:53469/"

db <<- "tweets"
username <- "Janice"
password <- "twitter"

# Create Database
 mongo <<- mongo.create(host=host ,db="tweets", username=username, password=password)


dbConnect <- function(DBNS, hostName, mongo) {
  setCursor <- function(mongo) {
    # get the database attributes from the server to help
    # define our database requests
    mongo.get.databases(mongo)

    # create the database namespace by appending the collection
    # name to the end of the database name
    DBNS <- paste("tweets", DBNS, sep=".")

    # get the database collection for the namespace and
    # return its cursor object
    mongo.get.database.collections(mongo, DBNS)
    print(DBNS)
    cursor <- mongo.find(mongo, ns = DBNS)
    invisible(cursor);
  }

  loopThroughCursor <- function(cursor) {
    i <- 0
    while (mongo.cursor.next(cursor)) {
      print("moving through cursor")
      # convert the current cursor document into a R-readible format
      # and assign to temp.
      tmp =  mongo.bson.to.list(mongo.cursor.value(cursor))
      # print temp to show you the data
      tmp.df = as.data.frame(t(unlist(tmp)), stringsAsFactors = F)
      # bind to the master dataframe
      listOfStatuses = rbind.fill(data.frame(stringsAsFactors = TRUE), tmp.df)

      print(str(listOfStatuses))
      # get each status
   #   for (i in listOfStatuses$statuses) {

        # assign the 'id' attribute of the statuses documents to a variable k
    #    k <- i$id
        # set k to the min and max values if it deserves to be
    #    if (k > max_id) max_id <<- k;
    #    if (k < min_id || min_id == 0) min_id <<- k;

        # print each status once
     #   print(i$status)
    #  }
    }
  }

  # if we are connected to the database get an iterator
  # start looping through the documents in the collection

  if (mongo.is.connected(mongo)) {
    print("mongo")
    cursor <- setCursor(mongo)

    loopThroughCursor(cursor)

    # I forget why I put this here...
  } else {

    loopThroughCursor(setCursor(mongo))
  }
}

getPages <- function(start, end, goBackInTime, queryParameters, dbCollection) {
  # repeat this loop until end - start iterations have occured

  #q <- start
 # repeat {

      # Name each collection is based of the twitter request that generated it
      # That way we can use the function db.get.collection('collectionName')
      # from the database and only return new data
      # We change the name of each collection by appending the value of the current
      # loop iteration
   #   if (start > q)
       # dbCollection <- paste(dbCollection, start, sep = "-")

     #   dbCollection <- paste(dbCollection, start, sep = "-")

      # Boolean value 'goBackInTime' provides a way to break up large queries
      # into smaller ones without any duplicates. After the first request,
      # We find the tweet with the lowest ID (that means it was the first created in
      # the set. For the following request, we set the parameter 'max_id' equal to
      # the lowest id we found. This requires all the tweets to have lower ids than
      # the 'max_id', and thus they were not in the previous data sets. The boolean
      # value 'goBackInTime', denotes whether we the lowest or highest user ID as the
      # the 'min' or 'max' id of the following request, and thus whether we search, forwards
      # or backwards throughout twitter history.

  #    if (goBackInTime && (min_id != 0)) queryParameters$max_id <- min_id;
  #   if (!goBackInTime && (max_id != 0)) queryParamters$since_id <- max_id;
      # take the query parameters and convert them into a JSON string (that the server will understand)

      query <<- toJSON(queryParameters)
      print(query)
      # connect to the server and send request for the twitter data
     response <- postForm(serverHost, .opts= list(postfields = query ,httpheader = c('Content-Type' = 'application/json', Accept = 'application/json' )))
      # A server response of 200 means that our request was executed and uploaded to the database successfully. Test if it was successful. Exit the program if it was not.
      # At this time we then call the function 'dbConnect' to download the frames from the new collection to the current R environment
      if (response) {
        print(response);
        dbConnect(dbCollection, host, mongo)
      } else {
        break;
      }
 #    start <- (start + 1)
 #   if (start > end) break;
 # }
}

# DB collection named after this run of the program (so the query, because we only save unique data!)
query <- "AAPL"
dbCollection <- "country"
dbConnect(dbCollection, host, mongo)

# query parameter (you can choose to modify these in the loop above after each iteration)
initialParameters <- list(
  collection = dbCollection,
  topsy = list(
    q = query,
    since = "2013-06-01",
    until = "2014-01-01"
  )
)
dbConnect(dbCollection, host, mongo)
# We start the program by requesting 5 pages (so 500) tweets with the query string "GWPH OR GW Pharmaceuticals"
df <- getPages(1, 5, TRUE, initialParameters, dbCollection)

