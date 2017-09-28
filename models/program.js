var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ProgramWeek = mongoose.model('ProgramWeek')

var ProgramSchema = Schema({
    name: String,
    weeks: [{ week_id: String }]
})

ProgramSchema.statics.getAllids = function (cb) {
    this.find({}, { _id: 1 }).exec((err, ids) => {
        if (err) return cb(err)
        var idsarray = []
        var itemsProcessed = 0
        ids.forEach((id, index, array) => {
            idsarray.push(id._id)
            itemsProcessed++
            if (itemsProcessed === array.length) {
                cb(null, idsarray)
            }
        })
    })
}

ProgramSchema.statics.getProgramInfo = function (id, cb) {
    var query = (id) ? { '_id': id } : {} // на будущее
    this.find(query).exec((err, program) => {
        if (err) return cb(err)
        var done_program = {}
        var itemsProcessed = 0
        program[0].weeks.forEach((week, index, array) => {
            ProgramWeek.getProgramWeek(week.week_id, (err, week_name, week_days) => {
                done_program[week_name] = week_days
                itemsProcessed++
                if (itemsProcessed === array.length) {
                    cb(null, program[0].name, done_program)
                }
            })
        })
    })
}

ProgramSchema.statics.addProgram = function (name, week_ids, callback) {
    var newProgram = new this()
    newProgram.name = name
    week_ids.forEach((week_id) => {
        newProgram.weeks.push({ 'week_id': week_id })
    })
    newProgram.save()
    callback(null, true)
}

module.exports = mongoose.model('Program', ProgramSchema)