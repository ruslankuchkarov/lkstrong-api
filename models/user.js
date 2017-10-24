var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var UserSchema = Schema({
    name: String,
    program: {
        program_id: String,
        program_start_date: Date,
        progress: Number
    },
    achievements: [String],
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

function filterScores(scores, dateFrom, dateTo, cb) {
    scoresArray = []
    scores.forEach((score, index, array) => {
        if (new Date(score.date) >= new Date(dateFrom) && new Date(score.date) <= new Date(dateTo)) {
            scoresArray.push(score)
        }
        if ((index + 1) === array.length) {
            cb(null, scoresArray)
        }
    })
}

UserSchema.statics.getStatByName = function (name, cb) {
    this.findByName(name, (err, result) => {
        if (err || result.length == 0) return cb(err, null)
        cb(null, result[0].scores)
    })
}


UserSchema.statics.getStatByDateAndName = function (name, date_from, date_to, callback) {
    this.findByName(name, (err, user) => {
        if (err || user.length == 0) return cb(err, null)
        filterScores(user[0].scores, date_from, date_to, (err, filtered_scores) => {
            callback(null, filtered_scores)
        })
    })
}

UserSchema.statics.getAllStat = function (cb) {
    this.find().exec((err, users) => {
        if (err) return cb(err)
        var userMap = []
        users.forEach((user) => {
            userMap.push({'name': user.name, 'scores': user.scores})
        })
        cb(null, userMap)
    })
}

UserSchema.statics.getAllStatByDate = function (date_from, date_to, cb) {
    this.find({ 'scores.date': { $gte: new Date(date_from), $lte: new Date(date_to) } }).exec((err, found_users) => {
        if (err) return cb(err)
        var userMap = {}
        found_users.forEach((user, index, array) => {
            filterScores(user.scores, date_from, date_to, (err, filtered_scores) => {
                userMap[user.name] =  filtered_scores
            })
            console.log(index, array.length)
            if ((index + 1) === array.length) {
                console.log('done')
                console.log(userMap)
                cb(null, userMap)
            }
        })
        
    })
    
}

UserSchema.statics.getProgram = function (name, callback) {
    this.findByName(name, (err, result) => {
        if (err || result.length == 0) { return callback(err, null) }
        callback(null, result[0].program.program_id)
    })
}

UserSchema.statics.createUser = function (name, program_id, callback) {
    this.findByName(name, (err, result) => {
        if (err) { return callback(err, false) }
        if (result.length == 0) {
            var newUser = new this()
            newUser.name = name
            newUser.program.program_id = program_id
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
        user.program.program_id = program_id
        user.save()
        callback(null, true)
    })
}

UserSchema.statics.startProgram = function (name, start_date, callback) {
    this.findByName(name, (err, result) => {
        if (err || result.length == 0) {
            return callback(err, false)
        }
        var user = new this(result[0])
        user.program.program_start_date = start_date
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