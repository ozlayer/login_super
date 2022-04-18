    const express     = require ('express');
    const path        = require ('path');
    const bodyParser  = require ('body-parser');
    const app         = express ();

    const bcrypt      = require ('bcrypt');
    const mongoose    = require ('mongoose');
    const User        = require ('./public/user');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false}));
    
    app.use(express.static(path.join(__dirname, 'public')));

    const mongo_uri = 'mongodb://localhost/login_metro';

    mongoose.connect(mongo_uri, function(err){
        if (err) {
            throw err;
        }else{
            console.log('Successfully connected to ${mongo_uri}');
        }
    });
    
    app.post('/register', (req, res) =>{
        const {username, password} = req.body;

        const user = new User({username, password});

        user.save(err =>{
            if(err){
                res.status(500).send('ERROR AL REGISTRAR USUARIO');
            }else{
                res.status(200).send('USUARIO REGISTRADO');
            }
        });
    });

    app.post('/authenticate', (req, res) =>{
        const {username, password} = req.body;

        User.findOne({username}, (err, user) =>{
            if(err){
                res.status(500).send('ERROR AL AUTENTICAR AL USUARIO');
            }else if(!User){
                res.status(500).send('EL USUARIO NO EXISTE');
            }else{
                user.isCorrectPassword(password, (err, result) =>{
                    if(err){
                        res.status(500).send('ERROR AL AUTENTICAR');
                    }else if(result){
                        res.status(200).send('USUARIO AUTENTICADO CORRECTAMENTE');
                    }else{
                        res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTOS');
                    }
                });
            }
        });
    });

    app.listen(3000, () =>{
        console.log('server started')
    })

    module.exports = app;

    


