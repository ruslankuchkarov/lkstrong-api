var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('User')

/**
   * @swagger
   * /users:
   *   post:
   *     description: Регистриует юзера с id программы тренировок
   *     consumes:
   *       - application/json
   *     parameters:
     *        - name: User
     *          in: body
     *          description: Имя пользователя и id его программы тренировок
     *          schema:
    *              $ref: "#/definitions/User"
   *     responses:
   *       200:
   *         User ${name} was created!
   *       409:
*            User ${name} already exists!
* definitions:
*   User:
*     type: object
*     required:
*       - name
*       - program_id
*     properties:
*       name:
*         type: string
*       program_id:
*         type: string
*/
router.post('/', function (req, res) {
    var name = req.body.name
    var program_id = req.body.program_id
    if(!name || !program_id) {
        console.log(name + " " + program_id)
        res.status(400).send()
        return
    }
    User.createUser(name, program_id, (err, success) => {
        if (err) { 
            res.status(500).send(err.message) 
            return
        }
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
     *        - name: User
     *          in: body
     *          description: Имя пользователя и id его программы тренировок
     *          schema:
    *              $ref: "#/definitions/User"
   *     responses:
   *       200:
   *         Changed program for ${name} to ${program_id}!!
*/
router.post('/program', (req, res) => {
    var name = req.body.name
    var program = req.body.program_id
    if(!name || !program) {
        res.status(400).send()
        return
    }
    User.setProgram(name, program, (err, success) => {
        if (err) { 
            res.status(500).send(err.message) 
            return
        }
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
   *       - name: Score
   *         in: body
   *         description: Имя пользователя, количество отжиманий и опционально дата тренировки
   *         schema:
   *           type: object
   *           required:
   *             - name
   *             - score
   *           properties:
   *             name:
   *               type: string
   *             score:
   *               type: integer
   *             date:
   *               type: string
   *               format: date
   *     responses:
   *       200:
   *         description: done!
   *       400:
   *         description: 
   *       404:
   *         description: User not found!
*/
router.post('/score', (req, res) => {
    var name = req.body.name
    var date = req.body.date
    var score = req.body.score
    if(!name || !score) {
        res.status(400).send()
        return
    }
    User.addScore(name, score, date, (err, success) => {
        if (err) { 
            res.status(500).send(err.message) 
            return
        }
        if (!success) { 
            res.status(404).send("User not found!") 
        } else {
            res.send('done!')
        }
    })
})

/**
 * @swagger
 * /users/stat:
 *   get:
 *     description: Возвращает результаты тренировок. Если мя не указано, то возвращаются результаты всех юзеров.
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Имя пользователя
 *         required: false
 *     responses:
 *       200:
 *         content:
 *           'application/json':
 *         example: 
 *           count: 1
 *           scores: [{score: 86, date: 2017-09-12T09:30:01.436Z, _id: 59b7a919dba5bb25bfb37f42}]
 *       404:
 */
router.get('/stat', (req, res) => {
    var name = req.query.name
    if (name) {
        User.getStat(name, (err, scores) => {
            if (err) { 
                res.status(500).send(err.message) 
                return
            }
            if (!scores) {
                res.status(404).send("User not found!")
            } else {
                res.send({ 'count': scores.length, 'scores': scores })
            }
        })
    } else {
        User.getAllStat((err, users) => {
            if (err) { 
                res.status(500).send(err.message) 
                return
            }
            res.send({ 'count': Object.keys(users).length, 'users': users })
        })
    }
})

/**
   * @swagger
   * /users/program:
   *   get:
   *     description: Возвращает ID привязанной программы тренировок
   *     consumes:
   *      - application/json
   *     parameters:
   *      - name: name
   *        in: query
   *        description: Имя пользователя
   *        required: true
   *     responses:
   *       200:
   *         content:
   *           'application/json':
   *         example: 
   *           program_id: 59bcc62d50bce82d5339d744
   */
router.get('/program', (req, res) => {
    var name = req.query.name
    if(!name) {
        res.status(400).send()
        return
    }
    User.getProgram(name, (err, program_id) => {
        if (err) { 
            res.status(500).send(err.message) 
            return
        }
        if (!program_id){
            res.status(404).send()
        }else {
            res.send({ 'program_id': program_id })
        }
    })
})

module.exports = router