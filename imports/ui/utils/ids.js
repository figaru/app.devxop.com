
Match._id = Match.Where(function (id) {
    check(id, String);
    //TEST: Match.test("bxxpwy2cwGNum", Match._id)
    return /[a-zA-Z0-9]{17,17}/.test(id);
});

isMeteorId = function(val){
    return Match.test(val, Match._id);
} 
