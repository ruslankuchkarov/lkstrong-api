var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('User')

/**
 * tags:
  - name: users
    description: Всё, что связано с пользователями
   * @swagger
   * /users:
   *   post:
   *     tags:
   *       - users
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
    if (!name || !program_id) {
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
   *     tags:
   *       - users
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
    if (!name || !program) {
        res.status(400).send()
        return
    }
    User.setProgram(name, program, (err, success) => {
        if (err) {
            res.status(500).send(err.message)
            return
        }
        if (!success) {
            res.status(404).send()
        } else {
            res.send(`Changed program for ${name} to ${program}!`)
        }
    })
})

/**
   * @swagger
   * /users/program/start:
   *   post:
   *     tags:
   *       - users
   *     description: Запускает программу тренировки
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: User
   *          in: body
   *          description: Имя пользователя
   *          schema:
   *            type: object
   *            required:
   *              - name
   *              - start_date
   *            properties:
   *              name:
   *                type: string
   *              start_date:
   *                type: string
   *                format: date
   *     responses:
   *       200:
   *         Program started!
*/
router.post('/program/start', (req, res) => {
    var name = req.body.name
    var start_date = req.body.start_date
    if (!name || !start_date) {
        res.status(400).send()
        return
    }
    User.startProgram(name, start_date, (err, success) => {
        if (err) {
            res.status(500).send(err.message)
            return
        }
        if (!success) {
            res.status(404).send()
        } else {
            res.send(`Program started!`)
        }
    })
})

/**
   * @swagger
   * /users/program/stop:
   *   post:
   *     tags:
   *       - users
   *     description: Останавливает программу тренировки
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: User
   *          in: body
   *          description: Имя пользователя
   *          schema:
   *            type: object
   *            required:
   *              - name
   *            properties:
   *              name:
   *                type: string
   *     responses:
   *       200:
   *         Program stopped!
*/
router.post('/program/stop', (req, res) => {
    var name = req.body.name
    if (!name) {
        res.status(400).send()
        return
    }
    User.stopProgram(name, (err, success) => {
        if (err) {
            res.status(500).send(err.message)
            return
        }
        if (!success) {
            res.status(404).send()
        } else {
            res.send(`Program stopped!`)
        }
    })
})

/**
   * @swagger
   * /users/program/pause:
   *   post:
   *     tags:
   *       - users
   *     description: Ставит программу тренировки на паузу
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: User
   *          in: body
   *          description: Имя пользователя
   *          schema:
   *            type: object
   *            required:
   *              - name
   *            properties:
   *              name:
   *                type: string
   *     responses:
   *       200:
   *         Program paused!
*/
router.post('/program/pause', (req, res) => {
    var name = req.body.name
    if (!name) {
        res.status(400).send()
        return
    }
    User.pauseProgram(name, (err, success) => {
        if (err) {
            res.status(500).send(err.message)
            return
        }
        if (!success) {
            res.status(404).send()
        } else {
            res.send(`Program paused!`)
        }
    })
})

/**
   * @swagger
   * /users/score:
   *   post:
   *     tags:
   *       - users
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
    if (!name || !score) {
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
 *     tags:
 *       - users
 *     description: Возвращает результаты тренировок пользователя.
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Имя пользователя
 *         required: true
 *       - name: date_from
 *         in: query
 *         description: Дата от
 *         required: false
 *       - name: date_to
 *         in: query
 *         description: Дата до
 *         required: false
 *     responses:
 *       200:
 *         content:
 *           'application/json':
 *         example: 
 *           count: 2
 *           result: [{score: 86, date: 2017-09-12T09:30:01.436Z, _id: 59b7a919dba5bb25bfb37f42}, {score: 24, date: 2017-09-14T09:30:01.436Z, _id: 59b7a919daa1bb25bfb37f42}]
 *       404:
 */
router.get('/stat', (req, res) => {
    var name = req.query.name
    var date_from = req.query.date_from
    var date_to = req.query.date_to
    if (date_from) {
        User.getStatByDateAndName(name, date_from, date_to, (err, scores) => {
            if (err) {
                res.status(500).send(err.message)
                return
            }
            if (!scores) {
                res.status(404).send("Scores not found!")
            } else {
                res.send({ 'count': scores.length, 'result': scores })
            }
        })
    } else {
        User.getStatByName(name, (err, scores) => {
            if (err) {
                res.status(500).send(err.message)
                return
            }if (!scores) {
                res.status(404).send("Scores not found!")
            } else {
                res.send({ 'count': scores.length, 'result': scores })
            }
        })
    }
})

/**
 * @swagger
 * /users/stat/all:
 *   get:
 *     tags:
 *       - users
 *     description: Возвращает результаты тренировок всех юзеров.
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: date_from
 *         in: query
 *         description: Дата от
 *         required: false
 *       - name: date_to
 *         in: query
 *         description: Дата до
 *         required: false
 *     responses:
 *       200:
 *         content:
 *           'application/json':
 *         example: 
 *           count: 1
 *           result: [{name: ruslan, scores: [{score: 86, date: 2017-09-12T09:30:01.436Z, _id: 59b7a919dba5bb25bfb37f42}]}]
 *       404:
 */
router.get('/stat/all', (req, res) => {
    var date_from = req.query.date_from
    var date_to = req.query.date_to
    if (date_from) {
        User.getAllStatByDate(date_from, date_to, (err, users) => {
            if (err) {
                res.status(500).send(err.message)
                return
            }
            if (!users) {
                res.status(404).send("Scores not found!")
            } else {
                res.send({ 'count': users.length, 'result': users })
            }
        })
    } else {
        User.getAllStat((err, users) => {
            if (err) {
                res.status(500).send(err.message)
                return
            }
            res.send({ 'count': users.length, 'result': users })
        })
    }
})

/**
 * @swagger
 * /users/info:
 *   get:
 *     tags:
 *       - users
 *     description: Возвращает данные пользователя.
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Имя пользователя
 *         required: true
 *     responses:
 *       200:
 *         content:
 *           'application/json':
 *         example: 
 *           {_id: 59f3191bc1579a3a629a3ac7, name: xren, program: {id: asdsadsadsadsa, start_date: 2017-09-12T00:00:00.000Z, status: started}}
 *       404:
 */
router.get('/info', (req, res) => {
    var name = req.query.name
    User.getInfo(name, (err, result) => {
        if (err) {
            res.status(500).send(err.message)
            return
        } if (!result) {
            res.status(404).send("User not found!")
        } else {
            res.send(result)
        }
    })
})

module.exports = router