var express = require('express'),
    router = express.Router()
ProgramWeek = require('../models/programWeek')
Program = require('../models/program')
User = require('../models/user')

router.use('/api/programs', require('./program'))
router.use('/api/users', require('./user'))

module.exports = router