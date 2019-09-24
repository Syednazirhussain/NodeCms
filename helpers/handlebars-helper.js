const moment = require('moment')

module.exports = {
    select: (selected, option) => {
        return option.fn(this).replace(new RegExp('value=\"'+ selected +'\"'), '$&selected="selected"')
    },
    optionsList: (aOptions, sSelectedOptionValue, sOptionProperty, options) => {
        var out = "";
        for ( var i = 0, l = aOptions.length; i < l; i++ )
        {
          aOptions[ i ].isSelected = '';
          if ( sSelectedOptionValue.toString() == aOptions[ i ][ sOptionProperty ].toString() )
          {
              aOptions[ i ].isSelected = 'selected';
          }
          out = out + options.fn( aOptions[ i ] );
        }
        return out;
    },
    formatDate: (date, format) => {
        return moment(date).format(format)
    },
    empty: (jsObj) => {
        if (Object.keys(jsObj).length) {
            return true
        } else {
            return false
        }
    },
}