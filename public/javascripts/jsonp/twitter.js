
$(document).ready(function(urlData){
 $.ajax({
     url: urlData,
     dataType: 'jsonp',
     success: function(dataWeGotViaJsonp){
       var text = '';
       var len = dataWeGotViaJsonp.length;
       for(var i=0;i<len;i++){
           twitterEntry = dataWeGotViaJsonp[i];
           text += '<p><img src = "' + twitterEntry.user.profile_image_url_https +'"/>' + twitterEntry['text'] + '</p>'
       }
       $('#twitterFeed').html(text);
     }
 });
})