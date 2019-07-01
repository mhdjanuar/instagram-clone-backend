const express = require('express')
const bodyParser = require('body-parser')
require('express-group-routes')
const jwt = require('jsonwebtoken')
const app = express()
const expressJwt = require('express-jwt')

app.use(bodyParser.json())


const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'instagram_db'
})

app.group("/api/v1", (router) =>{

    router.post('/login', (req, res)=>{
        const email = req.body.email
        const password = req.body.password

        connection.query('SELECT * FROM users WHERE email = "'+email+'" AND password = "'+password+'" ', function (err, rows, fields) {
            if (err) throw err

            if(rows.length > 0 ){
                const id = rows[0].id
                const name = rows[0].name
                const token = jwt.sign({ email: email }, 'shhhh')

                res.json({id,user:name,token:token})
            }else{
                res.json({error:'data not found'})
                // res.send(401, 'Wrond Email or Password!')
            }
        })
    })

    router.get('/posts',expressJwt({secret:'shhhh'}),(req,res)=>{
       
        connection.query('SELECT * FROM posts ORDER BY id DESC', function (err, rows, fields) {
            if (err) throw err

            res.send(rows)
        })

    })

    // router.get('/posts',(req,res)=>{
       
    //     connection.query('SELECT * FROM posts', function (err, rows, fields) {
    //         if (err) throw err

    //         res.send(rows)
    //     })

    // })

    
    router.post('/post', (req,res)=>{
        const name = req.body.name
        const photo = req.body.photo
        const caption = req.body.caption

        connection.query('INSERT INTO posts (name, photo, caption) VALUES( "'+name+'" , "'+photo+'" ,"'+caption+'")', function (err, rows, fields) {
            if (err) throw err

            res.send(rows)
        })
    })
    
    router.patch('/post/:id', (req, res)=>{
        const id = req.params.id
        const photo = req.body.photo
        const caption = req.body.caption
        
        connection.query('UPDATE posts SET photo="'+photo+'", caption="'+caption+'" WHERE id='+id+' ', function (err, rows, fields) {
            if (err) throw err

            res.send(rows)
        })
    })
    
    router.delete('/post/:id',(req,res)=>{
        const id = req.params.id

        connection.query('DELETE FROM posts WHERE id = '+id+' ', function (err, rows, fields) {
            if (err) throw err

            res.send(rows)
        })
    })

})



app.listen('5000',()=> console.log("App Running!"))