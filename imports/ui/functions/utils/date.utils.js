
Template.registerHelper("parseDate", function (d) {return parseDate(d);});
parseDate = function(d){
    d = new Date(d);
    return ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + 
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
}