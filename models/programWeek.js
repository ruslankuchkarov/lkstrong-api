var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ProgramWeekSchema = Schema({
    name: String,
    days: [{name: String, counts: [Number]}]
})

ProgramWeekSchema.statics.findByName = function(name, callback) {
    return this.find({'name':name}, callback)
}

ProgramWeekSchema.statics.findById = function(id, callback) {
    return this.find({'_id':id}, callback)
}

ProgramWeekSchema.statics.addProgramWeek = function(name, days, callback) {
    var newProgramWeek = new this()
    newProgramWeek.name = name
    days.forEach((day) => {
        newProgramWeek.days.push({
            'name':day.name,
            'counts':day.counts
        })
      })
    newProgramWeek.save()
    callback(null, true)
}

ProgramWeekSchema.statics.getProgramWeek = function(id, callback) {
    this.findById(id, (err, result) => {
        if (err || result.length==0){ return callback(err, []) }
        callback(null, result[0])
    })
}

module.exports = mongoose.model('ProgramWeek', ProgramWeekSchema)