var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var UserSchema = Schema({
    name: String,
    program: {
        id: String,
        start_date: Date,
        progress: Number,
        status: {type: String, enum: ['not_started', 'started', 'paused', 'stopped'], default: 'not_started'}
    },
    achievements: [String],
    scores: [{ date: Date, score: Number }]
})

function filterScores(scores, dateFrom, dateTo, cb) {
    scoresArray = []
    scores.forEach((score, index, array) => {
        score_date = new Date(score.date).setHours(0,0,0,0)
        date_from = new Date(dateFrom).setHours(0,0,0,0)
        date_to = new Date(dateTo).setHours(0,0,0,0)
        if (score_date >= date_from && score_date <= date_to) {
            scoresArray.push(score)
        }
        if ((index + 1) === array.length) {
            cb(null, scoresArray)
        }
    })
}

UserSchema.statics.findByName = function (name, callback) {
    return this.find({ 'name': name }, callback)
}

UserSchema.statics.all = function (cb) {
    this.find().exec((err, users) => {
        if (err) return cb(err)
        cb(null, users)
    })
}

UserSchema.statics.getInfo = function (name, cb) {
    this.find({'name': name}, {'__v': 0, 'scores': 0}).exec((err, result) => {
        console.log(result)
        if (err || result.length == 0) return cb(err, null)
        cb(null, result[0])
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
    date_from_in_mongo = new Date(date_from).setHours(0,0,0,0)
    date_to_in_mongo = new Date(date_to).setHours(23,59,59,59)
    this.find({ 'scores.date': { $gte: date_from_in_mongo, $lte: date_to_in_mongo } }).exec((err, found_users) => {
        if (err) return cb(err)
        var userMap = []
        found_users.forEach((user, index, array) => {
            filterScores(user.scores, date_from, date_to, (err, filtered_scores) => {
                userMap.push({'name': user.name, 'scores': filtered_scores})  
            })
            if ((index + 1) === array.length) {
                cb(null, userMap)
            }
        })
        
    })
    
}

UserSchema.statics.getProgram = function (name, callback) {
    this.findByName(name, (err, result) => {
        if (err || result.length == 0) { return callback(err, null) }
        callback(null, result[0].program.id)
    })
}

UserSchema.statics.createUser = function (name, program_id, callback) {
    this.findByName(name, (err, result) => {
        if (err) { return callback(err, false) }
        if (result.length == 0) {
            var newUser = new this()
            newUser.name = name
            newUser.program.id = program_id
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
        user.program.id = program_id
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
        user.program.start_date = start_date
        user.program.status = 'started'
        user.save()
        callback(null, true)
    })
}

UserSchema.statics.stopProgram = function (name, callback) {
    this.findByName(name, (err, result) => {
        if (err || result.length == 0) {
            return callback(err, false)
        }
        var user = new this(result[0])
        user.program.start_date = null
        user.program.status = 'stopped'
        user.save()
        callback(null, true)
    })
}

UserSchema.statics.pauseProgram = function (name, callback) {
    this.findByName(name, (err, result) => {
        if (err || result.length == 0) {
            return callback(err, false)
        }
        var user = new this(result[0])
        user.program.status = 'paused'
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