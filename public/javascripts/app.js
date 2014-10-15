//This is the Backbone controller that manages the content of the app

function launch(routeList) {
    function buildContentList(contentList, callback) {
        for (var key in contentList) {
            if (contentList[key] === 'object') {
                buildContentList(contentList[key], function (result) {
                    contentList[key] = result;
                });
            } else {
                contentList[key] = _.template(document.getElementById(key).innerHTML);
            }
        }
        callback(contentList);
    };

    buildContentList(routeList, function (contentList) {
        var Content = Backbone.View.extend({
            initialize:function(options){
                Backbone.history.on('route', function(source, path){
                    this.render(path);
                }, this);
            },
            //This object defines the content for each of the routes in the application
            content: contentList,
            render:function(route){
                //Simply sets the content as appropriate
                this.$el.html(this.content[route]);
            }
        });
    });

    //This is the Backbone controller that manages the Nav Bar
    var NavBar = Backbone.View.extend({
        initialize:function(options){
            Backbone.history.on('route', function(source, path){
                this.render(path);
            }, this);

        },
        //This is a collection of possible routes and their accompanying
        //user-friendly titles
        routes: routeList,
        events:{
            'click a':function(source) {
                var hrefRslt = source.target.getAttribute('href');
                Backbone.history.navigate(hrefRslt, {trigger:true});
                //Cancel the regular event handling so that we won't actual change URLs
                //We are letting Backbone handle routing
                return false;
            }
        },
        //Each time the routes change, we refresh the navigation
        //items.
        render: function(route){
           this.$el.empty();
           var template = _.template("<li class='<%=active%>'><a href='<%=url%>'><%=visible%></a></li>");
           for (var key in this.titles)
           {
               this.$el.append(template({url:key,visible:this.titles[key],active:route === key ? 'active' : ''}));
           }
        }
    });

    //Every time a Router is instantiated, the route is added
    //to a global Backbone.history object. Thus, this is just a
    //nice way of defining possible application states
    new (Backbone.Router.extend({
        routes: routeList
    }));

    //Attach Backbone Views to existing HTML elements
    new NavBar({el: document.getElementById('nav-item-container')});

    new Content({el: document.getElementById('container')});

    //Start the app by setting kicking off the history behaviour.
    //We will get a routing event with the initial URL fragment
    Backbone.history.start();
}

