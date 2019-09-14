module.exports = {

    select: function (selected, option) {
        
        return option.fn(this).replace(new RegExp('value=\"'+ selected +'\"'), '$&selected="selected"')
    }


}