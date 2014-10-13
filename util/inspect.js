exports.inspect = function (object, result) {
    function inspect(object, result) {
        if (typeof object != "object")
            return "Invalid object";
        if (typeof result == "undefined")
            result = '';

        if (result.length > 50)
            return "[RECURSION TOO DEEP. ABORTING.]";

        var rows = [];
        for (var property in object) {
            var datatype = typeof object[property];

            var tempDescription = result+'"'+property+'"';
            tempDescription += ' ('+datatype+') => ';
            if (datatype == "object")
                tempDescription += 'object: '+ inspect(object[property],result+'  ');
            else
                tempDescription += object[property];

            rows.push(tempDescription);
        }//Close for

        return rows.join(result+"\n");
    }


    inspect(object, result);
}