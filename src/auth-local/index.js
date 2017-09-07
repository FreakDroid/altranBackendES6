import passport from 'passport';
import local from './authPassportStrategy';
import passportLocal from 'passport-local';
import request from 'request';
import _ from 'lodash';
const LocalStrategy = passportLocal.Strategy;

import express from 'express';
import wrap from 'co-express';

import * as serverUtil from '../serverUtil';

class AuthLocal {
    constructor(){

    }

    initialize(app){

        app.use(passport.initialize());
        app.use(passport.session());

        const self = this;

        passport.use('local', new LocalStrategy( (username, password, done) => {
            request.post("http://www.mocky.io/v2/5808862710000087232b75ac", (err, res, body) => {
                if (!err && res.statusCode === 200) {
                    self.processUser(body, username, password, (err, user) => {
                        if (user) {
                            done(null, user);
                        } else {
                            done(null, false, 'Incorrect email or password');
                        }
                    });
                }
                else{
                    done(null, false, 'Server error');
                }
            });
        }));

        passport.serializeUser( (userJson, done) => {
            done(null, JSON.stringify(userJson));
        });
        
        passport.deserializeUser((userString, done) => {
            done(null, JSON.parse(userString));
        });
    }

    processUser(users,username, password, callback) {
        //If the pass is 1234 your user will pass
        if (password == 1234) {
            // process input
            let usersParsed = JSON.parse(users);
            let user = _.find(usersParsed.clients, {'email': username});
            // console.log('User found ', user);
            callback(null, user);
        }
        else{
            callback("Wrong password");
        }
    }


    isAuth(req, res, next){
        //Middleware to check whether the user is authenticated or not
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/login');
        }
    }

    router(){

        const router = express.Router();
        //Routes to handle the authentication process
        router.get('/login',  (req, res) => {
            res.render('login', { error: req.flash('error') });
        });
    
        router.post('/login',  
            // wrap(function* (){
            //         passport.authenticate('local', {
            //             successRedirect: '/home',
            //             failureRedirect: '/login',
            //             failureFlash: true
            //         });
            //     })

            passport.authenticate('local', {
                            successRedirect: '/home',
                            failureRedirect: '/login',
                            failureFlash: true
                        })
        );
    
        router.get('/logout', (req, res) => {
            req.logout();
            res.redirect('/login');
        });

        router.get('/home', this.isAuth, (req, res) => {
            res.render('partials/home', {user: req.user});
        });

        //Search by id
        router.get('/user/id/:id', this.isAuth, (req, res) => {
            serverUtil.getUserById(req.params.id).then(success =>{
                 res.render('partials/users/user', {user: success});
            }).catch(err =>{
                 res.render('partials/users/user', {error: err});
            });
        });


        router.get('/userSearcher', this.isAuth, (req, res) => {
            res.render('partials/users/userSearcher', {user: req.user});
        });

        router.post('/userSearcher', this.isAuth, (req, res) => {
            
            let userId = req.body.userid;
            let name = req.body.username;

            //How I'm using the same page to both search, I check the param in the body
            //Depending on which one is, I redirect to the correct page
            if(userId){ 
                res.redirect('/user/id/' + userId);
            }
            else{
                res.redirect('/user/name/' + name);
            }
        });


        router.get('/policiesSearcher', this.isAuth, (req, res) => {
            res.render('partials/policies/policiesSearcher', {user: req.user});
        });

        router.post('/policiesSearcher', this.isAuth, (req, res) => {
            
            let policyNumber = req.body.policyNumber;
            let name = req.body.username;

            //How I'm using the same page to both search, I check the param in the body
            //Depending on which one is, I redirect to the correct page
            if(policyNumber){ 
                res.redirect('/user/policeId/' + policyNumber);
            }
            else{
                res.redirect('/policies/name/' + name);
            }
        });

        //Search by name
        router.get('/user/name/:name', this.isAuth, (req, res) => {
            return serverUtil.getUserByName(req.params.name).then(success =>{
                res.render('partials/users/user', {user: success});
            }).catch(err =>{
                res.render('partials/users/user', {error: err});
            });
        });

        //Search by Policies name
        router.get('/policies/name/:name', this.isAuth, (req, res) => {
            //First I'm looking for the user, by the name provided
            serverUtil.getUserByName(req.params.name).then(success =>{
                //user found!!!!
                return success;
            }).then(user =>{
                //Im gonna look for the polices
                serverUtil.getPoliciesByUserId(user.id).then(polices =>{
                    res.render('partials/policies/policies', {policies: polices, user:user});  
                }).catch(err =>{
                    res.render('partials/policies/policies', {error: err});
                });
            }).catch(err =>{
                res.render('partials/policies/policies', {error: err});
            });
        });

        //Search by User Name by policeID
        router.get('/user/policeId/:id', this.isAuth, (req, res) => {
            if(req.user.role.toLowerCase() === 'admin'){
                //First I'm looking for the user, by the name provided
                serverUtil.getUserByPolicieId(req.params.id).then(success =>{
                    //user found!!!!
                    return success;
                }).then(police =>{
                    //Im gonna look for the polices
                    serverUtil.getUserById(police.clientId).then(user =>{
                        res.render('partials/users/user', {user: user});  
                    }).catch(err =>{
                        res.render('partials/users/user', {error: err});
                    });
                }).catch(err =>{
                    res.render('partials/users/user', {error: err});
                });
            }
            else{
                res.render('partials/accessDenied', {error: "You don't have permission to see this page"});
            }
        });

     return router;
    }

    
}

export default new AuthLocal();