var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Program = mongoose.model('Program'),
    ProgramWeek = mongoose.model('ProgramWeek')

/**
 * @swagger
 * definitions:
 *   Week:
 *     type: object
 *     required:
 *       - name
 *       - days
 *     properties:
 *       name:
 *         type: string
 *       days:
 *          type: array
 */
/**
   * @swagger
   * /programs/week:
   *   post:
   *     description: Добавляет недельное расписание тренировок
   *     produces:
   *       - application/json
   *     parameters:
     *        - name: name
     *          description: Название недели.
     *          required: true
     *          type: string
     *        - name: days
     *          description: Расписание тренировок.
     *          required: true
     *          type: array
     *          schema:
   *                $ref: '#/definitions/Week'
   *     responses:
   *       200:
   *            Program week ${name} was created!
*/
router.post('/week', (req, res) => {
    var name = req.body.name
    var days = req.body.days
    if(!name || !days) {res.status(400).send()}
    ProgramWeek.addProgramWeek(name, days, (err, success) => {
        if (err) { throw err }
        res.send(`Program week ${name} was created!`)
    })
})

/**
   * @swagger
   * /programs:
   *   post:
   *     description: Добавляет программу тренировок
   *     produces:
   *       - application/json
   *     parameters:
     *        - name: name
     *          description: Название тренировки.
     *          required: true
     *          type: string
     *        - name: week_ids
     *          description: Массив ID недельных расписаний тренировок
     *          required: true
     *          type: array
     *          schema: [String]
   *     responses:
   *       200:
   *            Program ${name} was created!
*/
router.post('/', (req, res) => {
    var name = req.body.name
    var week_ids = req.body.week_ids
    if(!name || !week_ids) {res.status(400).send()}
    Program.addProgram(name, week_ids, (err, success) => {
        if (err) { throw err }
        res.send(`Program ${name} was created!`)
    })
})

/**
 * @swagger
 * /programs?id=:
 *   get:
 *     description: Возвращает программу тренировок
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: id
 *         description: ID программы тренировки
 *         required: true
 *     responses:
 *       200:
 *         scores: {name: program_name, program: {week_name: [ {name: day_name, _id: db_id, counts: [Number]} ]}}
 */
router.get('/', (req, res) => {
    var program_id = req.query.id
    if(!program_id) {res.status(400).send()}
    Program.getProgramInfo(program_id, (err, name, program) => {
        if (err) { throw err }
        res.send({ 'program': program })
    })
})

/**
 * @swagger
 * /programs/ids:
 *   get:
 *     description: Возвращает все ID существующих программ тренировок
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         count: ids_count
 *         ids: [String]
 */
router.get('/ids', (req, res) => {
    Program.getAllids((err, ids) => {
        if (err) { throw err }
        res.send({ 'count': ids.length, ids })
    })
})

module.exports = router