#Twitter Feed

Enter querys to the provided domain name, within JSON format for specific keys.
Different keys require different parameters. The list of keys is as follows:

The first value can be either (or both) of "search" or "stream". Currently _the stream feature is disabled_. I will let you know once it gets pushed live.

    "search" : {
      <rest of params>
    },
    "stream" : {
      <rest of params>
    }


## Search Parameters

The only mandatory parameter for "search" is "q". The "q" key denotes the query you want to be executed. The server will accept all params twitter accepts for "q". Read this for more information https://dev.twitter.com/docs/using-search.


### Date Ranges

You can search for all tweets before a particular date using the "since" key. Set the value to a standardized DateTime string with timezone. The format is _YYYY-MM-DD_.

    "since":"2013-06-01"

You can search for all the tweets after a date with the "until" key. Same formatting as above.

    "until":"2014-01-01"

The use of 'since' and 'until' is independant, meaning they can, but don't have to, be used together.

### Filters

You can filter the tweets for links by including the "linkFilter" key. Setting the value for this key to false will not turn off its functionality. You have to remove the key from the set to do that.

    "linkFilter":true // is the same as
    "linkFilter":false // is the same as
    "linkFilter": []

### Feeds

You can source a particular twitter feed for tweets using "source". The value of "source" must be the id of the twitter feed you are trying to source from.

    "source":"some_twitter_feed"


##Stream parameters

The "stream" module takes in 4 parameters.

  - "track"
  - "locations"
  - "limit"
  - "timeLimit"

The only required key is "track", which requires at least one string. All items for "track" must be placed into an array. Thus, the minimum required parameters to run the streamer module are:

  "stream" : {
    "track" : ['my keyword']
  }

This will return the last 100 tweets containing the specified keyword. If their are less than 100 available live tweets, the streamer will quit after ten seconds.


### Links

You stream for links using the "track" key, but the value of the 'link' query string needs to be in a specific format. Stream for links using the format "name post-fix-domain-name". "name.com/".

For example:

  "stream" {
    'track':'youtube com'
  }

Would return the values:

  'I love youtube.com',
  'Watch this: www.youtube.com/some-video',
  'I love youtube compare'

This is highly inclusive so needs to be parsed well once the stream is received. A specific link can be streamed by using its full url:

  "stream" {
    'track':'www.youtube.com'
  }

Would return:

  'I am on www.youtube.com'

And NOT return:

  'I am on the video www.youtube.com/some-other-url'


### Location

You can choose to filter tweets by using the "locations" key. The location key has one value: a 4 column array with 4 co-ordinates.

The streamer "locations" key is an array that contains the latitude and longitude co-ordinates of a bounded box. All geo-coded tweets within this bounded box, that match the particular "track" parameters, will be returned.

For example:

  "stream" {
    "track": ["I just made a million dollars"],
    "locations": [ '-122.75', '36.8', '-121.75', '37.8' ] // Coords for San Francisco
  }

This will return all tweets containing the string "I just made a million dollars" that were posted by users in San Francisco.

### Limit

You can set a limit on the number of tweets you want the streamer to return before closing. The default is 100.

  "stream" {
    "limit": 1000
  }

Will stop streaming after 1000 tweets have been received.

### Time Limit

You can set an expiration time as well as a tweet limit. The streamer will close when the timer expires, if the limit has not been reached. This is useful to use to prevent queries with a low yeild from running forever.

The timer units are in milliseconds. The default timer value is 3000 (3 seconds).

  "stream" {
    "limit": 10000
  }

Will stop a non-expired stream after running for 10 seconds.

### Collection Name

For each query you issue to the node.js server, you must provide a collectionName. The server will then store the resulting streamer data at this location on the data, and send your client script a success message once the data storage has been executed successfully. Your client script then accesses the collection in the tweet database with this particular collectionName and pulls the tweets into R dataframes.

For this reason, it is important that each query you issue has a unique collection name. Storing multiple queries under the same collection will result in a bloated document that will absorb your memory once loaded.

##Examples

Below are tested examples of both search and stream query modules.

###Example 1

This is an example of a query to search for tweets containing both "Plug" and "Power". The "result_type" parameter (you can read about it on the twitter docs linked below), is set to return the most recent tweets. This is an example of executing that query from an R script (to send to the server). A list is generated in R with the necessary parameters, and the function toJSON() is called on it to convert it into a valid JSON string before sending.

    myRQuery <- toJSON(list(
      collection = "Plug Power",
      search = list(
        q = "Plug Power",
        result_type = "recent"
      )
    ))

### Example 2

Stream the last 1000 tweets that contained youtube urls and a reference to Katy Perry

  query = {
    "stream" : {
      "track": ["youtube com", "Katy Perry", "katy perry"]
      "limit": 1000
    }
  }

### Example 3

Stream for a minute for all live tweets containing a particular youtube link

  query = {
    "stream" : {
      "track": ["youtube.com/abc1223"],
      "limit": 100000,
      "timeLimit": 60000
    }
  }

##Read The Docs

For more information on valid/non-valid query parameters please visit https://dev.twitter.com/docs/api/1.1. Cheers.