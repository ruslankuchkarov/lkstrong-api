var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('User')

/**
   * @swagger
   * /users:
   *   post:
   *     description: Регистриует юзера с id программы тренировок
   *     produces:
   *       - application/json
   *     parameters:
     *        - name: name
     *          description: Имя пользователя, используемое для регистрации.
     *          required: true
     *          type: string
     *        - name: porgram_id
     *          description: ID программы тренировок, которая будет привязана к пользователю.
     *          required: true
     *          type: string
   *     responses:
   *       200:
   *         User ${name} was created!
   *       409:
*            User ${name} already exists!
*/
router.post('/', function (req, res) {
    var name = req.body.name
    var program_id = req.body.program_id
    if(!name || !program_id) {res.status(400).send()}
    User.createUser(name, program_id, (err, success) => {
        if (err) { throw err }
        if (!success) {
            res.status(409).send(`User ${name} already exists!`)
        }
        else {
            res.send(`User ${name} was created!`)
        }
    })
})

/**
   * @swagger
   * /users/program:
   *   post:
   *     description: Привязывает к юзеру id программы тренировок
   *     produces:
   *       - application/json
   *     parameters:
     *        - name: name
     *          description: Имя пользователя.
     *          required: true
     *          type: string
     *        - name: porgram_id
     *          description: ID программы тренировок.
     *          required: true
     *          type: string
   *     responses:
   *       200:
   *         Changed program for ${name} to ${program_id}!!
*/
router.post('/program', (req, res) => {
    var name = req.body.name
    var program = req.body.program_id
    if(!name || !program) {res.status(400).send()}
    User.setProgram(name, program, (err, success) => {
        if (err) { throw err }
        if (!success) {res.status(404).send()}
        res.send(`Changed program for ${name} to ${program}!`)
    })
})

/**
   * @swagger
   * /users/score:
   *   post:
   *     description: Записывает результат тренировки
   *     produces:
   *       - application/json
   *     parameters:
     *        - name: name
     *          description: Имя пользователя.
     *          required: true
     *          type: string
     *        - name: scores
     *          required: true
     *          type: number
     *        - name: date
     *          description: Дата тренировки.
     *          required: false
     *          type: string
     *          schema: yyyy-mm-dd
   *     responses:
   *       200:
   *       404:
*/
router.post('/score', (req, res) => {
    var name = req.body.name
    var date = req.body.date
    var score = req.body.score
    if(!name || !score) {res.status(400).send()}
    User.addScore(name, score, date, (err, success) => {
        if (err) { throw err }
        if (!success) { res.status(404).send() }
        res.send('done!')
    })
})

/**
 * @swagger
 * /users/stat:
 *   get:
 *     description: Возвращает результаты тренировок
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: name
 *         description: Имя пользователя
 *       - required: false
 *     responses:
 *       200:
 *         count: Количество пользователей
 *         scores: {name: [ {} ]}
 *       404:
 */
router.get('/stat', (req, res) => {
    var name = req.query.name
    if (name) {
        User.getStat(name, (err, scores) => {
            if (err) { return next(err) }
            if (scores.length == 0) {
                res.status(404).send()
            } else {
                res.send({ 'count': scores.length, 'scores': scores })
            }
        })
    } else {
        User.getAllStat((err, users) => {
            if (err) { return next(err) }
            res.send({ 'count': Object.keys(users).length, 'users': users })
        })
    }
})

/**
   * @swagger
   * /users/program?name=:
   *   get:
   *     description: Возвращает ID привязанной программы тренировок
   *     produces:
   *      - application/json
   *     parameters:
   *      - name: name
   *        description: Имя пользователя
   *      - required: true
   *     responses:
   *       200:
   *         program_id: ID привязанной программы тренировок
   */
router.get('/program', (req, res) => {
    var name = req.query.name
    if(!name) {res.status(400).send()}
    User.getProgram(program_id, (err, program) => {
        if (err) { return next(err) }
        res.send({ 'program_id': program_id })
    })
})

module.exports = router