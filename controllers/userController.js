const crypto = require('crypto')
const { sqlDB } = require('../databases')
const { uploader } = require('../helpers/uploader')
const { createJWTToken } = require('../helpers/jwt')

const secret = 'teletubies';

module.exports = {
    keepLogin: (req,res) => {
        // console.log(req.user)
        res.status(200).send({ ...req.user, token: req.token })
    },
    login: (req,res) => {
        var { email, password } = req.body;
        password = crypto.createHmac('sha256', secret)
                        .update(password)
                        .digest('hex');
    
        var sql = `SELECT u.id,u.username,u.email,u.displayname,u.profileimage,u.bio,r.role
                    FROM users u
                    JOIN roles r
                    ON u.roleId = r.id
                    WHERE email = ${sqlDB.escape(email)}
                    AND password = ${sqlDB.escape(password)};`;
        
        sqlDB.query(sql, (err, results) => {
            if(err) return res.status(500).send({ err, message: 'Database Error' })
    
            if(results.length === 0) {
                return res.status(500).send({ message: 'Email or Password Incorrect' })
            }
    
            var token = createJWTToken({ ...results[0] })
    
            res.status(200).send({ ...results[0], token })
        })
    },
    register: (req,res) => {
        req.body.joineddate = new Date()
    
        req.body.password = crypto.createHmac('sha256', secret)
                        .update(req.body.password)
                        .digest('hex');
        req.body.bio = ''
        req.body.roleId = 1
        req.body.displayname = req.body.username
        req.body.profileimage = '/default/default.jpg'

        var sql = `SELECT id FROM users WHERE email = ${sqlDB.escape(req.body.email)};`;
    
        sqlDB.query(sql, (err,results) => {
            if(err) return res.status(500).send({ message:'Database Error Bro!', err, error: true })
    
            if(results.length > 0) {
                return res.status(500).send({ message: 'Email has been taken!', error: true})
            }
    
            sql = `INSERT INTO users SET ? `;
            sqlDB.query(sql, req.body, (err, results) => {
                if(err) return res.status(500).send({ message:'Database Error Bro!', err, error: true })
           
                res.status(200).send({ result: results, email: req.body.email })
            })
        })
    },
    editProfileData: (req,res) => {
        var data = req.body;
        var sql = `UPDATE users SET ? WHERE id = ${req.user.id}`
           
        sqlDB.query(sql, data, (err, results) => {
            if(err) {
                return res.status(500).send(err)
            }
    
            res.status(200).send({ ...req.user, ...data })
        })
    },
    editProfileImage: (req,res) => {
        var data = req.body;
        var sql = `UPDATE users SET ? WHERE id = ${req.params.id}`
           
        sqlDB.query(sql, data, (err, results) => {
            if(err) {
                return res.status(500).send(err)
            }
    
            res.status(200).send(results)
        })
    }
}