var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Program = mongoose.model('Program'),
    ProgramWeek = mongoose.model('ProgramWeek')

/**
 * tags:
 * - name: programs
 *  description: Всё, что связано с программами тренировок
 * @swagger
 * definitions:
 *   Day:
 *     type: object
 *     required:
 *       - name
 *       - counts
 *     properties:
 *       name:
 *         type: string
 *       counts:
 *         type: array
 *         items:
 *           type: integer
 */
/**
   * @swagger
   * /programs/week:
   *   post:
   *     tags:
   *       - programs
   *     description: Добавляет недельное расписание тренировок
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: days
   *         in: body
   *         description: Расписание тренировок.
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - name
   *             - days
   *           properties:
   *             name:
   *               type: string
   *             days:
   *               type: array
   *               items:
   *                 $ref: "#/definitions/Day"
   *     responses:
   *       200:
   *            Program week ${name} was created!
*/
router.post('/week', (req, res) => {
    var name = req.body.name
    var days = req.body.days
    if (!name || !days) {
        res.status(400).send()
        return
    }
    ProgramWeek.addProgramWeek(name, days, (err, success) => {
        if (err) {
            res.status(500).send(err.message)
            return
        }
        res.send(`Program week ${name} was created!`)
    })
})

/**
   * @swagger
   * /programs:
   *   post:
   *     tags:
   *       - programs
   *     description: Добавляет программу тренировок
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: Program
   *          in: body
   *          description: Расписание тренировок.
   *          required: true
   *          schema:
   *            type: object         
   *            required:
   *              - name
   *              - week_ids
   *            properties:
   *              name:
   *                type: string
   *              week_ids:
   *                type: array
   *                items:
   *                  type: string
   *     responses:
   *       200:
   *            Program ${name} was created!
*/
router.post('/', (req, res) => {
    var name = req.body.name
    var week_ids = req.body.week_ids
    if (!name || !week_ids) {
        res.status(400).send()
        return
    }
    Program.addProgram(name, week_ids, (err, success) => {
        if (err) {
            res.status(500).send(err.message)
            return
        }
        res.send(`Program ${name} was created!`)
    })
})

/**
 * @swagger
 * /programs:
 *   get:
 *     tags:
 *       - programs
 *     description: Возвращает программу тренировок
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: id
 *         in: query
 *         description: ID программы тренировки
 *         required: true
 *     responses:
 *       200:
 *         content:
 *           'application/json':
 *         example:
 *           name: По харду
 *           weeks: 
 *             [{week_name: Первая неделя, days: [{name: пн, _id: 59b92a2101a53b1a7ad47eff, counts: [12, 14, 16, 15, 16]}]},
 *             {week_name: Вторая неделя, days: [{name: пн, _id: 59b82f2101a53b1a2ad59eaf, counts: [14, 16, 18, 16, 18]}]}]
 */
router.get('/', (req, res) => {
    var program_id = req.query.id
    if (!program_id) {
        res.status(400).send()
        return
    }
    Program.getProgramInfo(program_id, (err, name, program) => {
        if (err) {
            res.status(500).send(err.message)
            return
        }
        res.send({'name': name, 'weeks': program })
    })
})

/**
 * @swagger
 * /programs/program_ids:
 *   get:
 *     tags:
 *       - programs
 *     description: Возвращает массив ID всех существующих программ тренировок
 *     produces:
 *      - application/json
 *     responses:
   *       200:
   *         content:
   *           'application/json':
   *         example: 
   *           count: 2
   *           result: [{name: Первая неделя, id: 59bcc62d50bce82d5339d744}, 
   *                   {name: Вторая неделя, id: 59bcc62d50bce82d5339d745}]
 */
router.get('/program_ids', (req, res) => {
    Program.getAllids((err, ids) => {
        if (err) {
            res.status(500).send(err.message)
            return
        }
        res.send({ 'count': ids.length, 'result': ids })
    })
})

/**
 * @swagger
 * /programs/week:
 *   get:
 *     tags:
 *       - programs
 *     description: Возвращает недельную программу тренировок
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: id
 *         in: query
 *         description: ID недельной программы тренировки
 *         required: true
 *     responses:
 *       200:
 *         content:
 *           'application/json':
 *         example:
 *           name: Жаркая неделька
 *           days: [{name: пн, _id: 59b92a2101a53b1a7ad47eff, counts: [12, 14, 16, 15, 16]}, {name: вт, _id: 59b92a2101a53b1a7ad47eff, counts: [12, 14, 16, 15, 16]}]
 *       400:
 */
router.get('/week', (req, res) => {
    var program_id = req.query.id
    if (!program_id) {
        res.status(400).send()
        return
    }
    ProgramWeek.getProgramWeek(program_id, (err, name, days) => {
        if (err) {
            res.status(500).send(err.message)
            return
        }
        if (!name) {
            res.status(404).send()
            return
        }
        res.send({'name': name, 'days': days })
    })
})

/**
 * @swagger
 * /programs/week_ids:
 *   get:
 *     tags:
 *       - programs
 *     description: Возвращает массив ID всех существующих недельных программ тренировок
 *     produces:
 *      - application/json
 *     responses:
   *       200:
   *         content:
   *           'application/json':
   *         example: 
   *           count: 2
   *           result: [{name: Жаркая неделька, id: 59bcc62d50bce82d5339d744}, 
   *                   {name: Нормальная неделя, id: 59bcc62d50bce82d5339d745}]
 */
router.get('/week_ids', (req, res) => {
    ProgramWeek.getAllids((err, ids) => {
        if (err) {
            res.status(500).send(err.message)
            return
        }
        res.send({ 'count': ids.length, 'result': ids })
    })
})

module.exports = router