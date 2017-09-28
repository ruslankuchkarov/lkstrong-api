var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var UserSchema = Schema({
    name: String,
    program_id: String,
    scores: [{ date: Date, score: Number }]
})

UserSchema.statics.findByName = function (name, callback) {
    return this.find({ 'name': name }, callback)
}

UserSchema.statics.all = function (cb) {
    this.find().exec((err, users) => {
        if (err) return cb(err)
        cb(null, users)
    })
}

UserSchema.statics.getStat = function (name, cb) {
    this.findByName(name, (err, result) => {
        if (err || result.length == 0) return cb(err, null)
        cb(null, result[0].scores)
    })
}

UserSchema.statics.getAllStat = function (cb) {
    this.find().exec((err, users) => {
        if (err) return cb(err)
        var userMap = {}
        users.forEach((user) => {
            userMap[user.name] = user.scores
        })
        cb(null, userMap)
    })
}

UserSchema.statics.getProgram = function (name, callback) {
    this.findByName(name, (err, result) => {
        if (err || result.length == 0) { return callback(err, null) }
        callback(null, result[0].program_id)
    })
}

UserSchema.statics.createUser = function (name, program_id, callback) {
    this.findByName(name, (err, result) => {
        if (err) { return callback(err, false) }
        if (result.length == 0) {
            var newUser = new this()
            newUser.name = name
            newUser.program_id = program_id
            newUser.scores = []
            newUser.save()
            callback(null, true)
        } else callback(null, false)
    })
}

UserSchema.statics.setProgram = function (name, program_id, callback) {
    this.findByName(name, (err, result) => {
        if (err || result.length == 0) {
            return callback(err, false)
        }
        var user = new this(result[0])
        user.program_id = program_id
        user.save()
        callback(null, true)
    })
}

UserSchema.statics.addScore = function (name, score, date, callback) {
    this.findByName(name, (err, result) => {
        if (err || result.length == 0) {
            callback(err, false)
            return
        }
        var user = new this(result[0])
        if (!date) {
            date = new Date()
        }
        user.scores.push({ 'score': score, 'date': date })
        user.save()
        callback(null, true)
    })
}

module.exports = mongoose.model('User', UserSchema)