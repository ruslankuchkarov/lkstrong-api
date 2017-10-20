var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ProgramWeekSchema = Schema({
    name: String,
    days: [{ name: String, counts: [Number] }]
})

ProgramWeekSchema.statics.findByName = function (name, callback) {
    return this.find({ 'name': name }, callback)
}

ProgramWeekSchema.statics.findById = function (id, callback) {
    return this.find({ '_id': id }, callback)
}

ProgramWeekSchema.statics.addProgramWeek = function (name, days, callback) {
    var newProgramWeek = new this()
    newProgramWeek.name = name
    days.forEach((day) => {
        newProgramWeek.days.push({
            'name': day.name,
            'counts': day.counts
        })
    })
    newProgramWeek.save()
    callback(null, true)
}

ProgramWeekSchema.statics.getAllids = function (cb) {
    this.find({}, { _id: 1, name: 1 }).exec((err, ids) => {
        if (err) return cb(err)
        var idsarray = []
        var itemsProcessed = 0
        ids.forEach((id, index, array) => {
            idsarray.push({name: id.name, id: id._id})
            itemsProcessed++
            if (itemsProcessed === array.length) {
                cb(null, idsarray)
            }
        })
    })
}

ProgramWeekSchema.statics.getProgramWeek = function (id, callback) {
    this.findById(id, (err, result) => {
        if (err || result.length == 0) { return callback(err, null) }
        callback(null, result[0].name, result[0].days)
    })
}

module.exports = mongoose.model('ProgramWeek', ProgramWeekSchema)