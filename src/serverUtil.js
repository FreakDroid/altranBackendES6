import request from 'request';
import _ from 'lodash';
import Promise from 'promise';


       export const getUserById = (id) => {
        // public
        return new Promise((resolve, reject) => {
            request.get("http://www.mocky.io/v2/5808862710000087232b75ac", function(err, res, body) {
                if (!err && res.statusCode === 200) {
                    // process input
                    let usersParsed = JSON.parse(body);
                    let user = _.find(usersParsed.clients, {'id': id});
                    if (user){
                        return resolve(user);
                    }
                    else{
                        return reject("User doesn't exist");
                    }
                    
                }
                else{
                    return reject("Server Error");
                }
            });
        });
      };

      export const getUserByName = (name) => {
        return new Promise((resolve, reject) => {
            request.get("http://www.mocky.io/v2/5808862710000087232b75ac", function(err, res, body) {
                if (!err && res.statusCode === 200) {
                    // process input
                    let usersParsed = JSON.parse(body);
                    let user = _.find(usersParsed.clients, function(user){
                        return user.name.toLowerCase() === name.toLowerCase();
                    });
                    if (user){
                        return resolve(user);
                    }
                    else{
                        return reject("User doesn't exist");
                    }
                }
                else{
                    return reject("Server Error");
                }
            });
        });
      };

      export const getPoliciesByUserId = (userid) => {
        return new Promise((resolve, reject) => {
            request.get("http://www.mocky.io/v2/580891a4100000e8242b75c5", function(err, res, body) { 
                if (!err && res.statusCode === 200) {
                    // process input
                    let policiesParsed = JSON.parse(body);
                    let policies = _.filter(policiesParsed.policies, {'clientId': userid});
                    if (policies){
                        return resolve(policies);
                    }
                    else{
                        return reject("Policies doesn't exist");
                    }
                }
                 else{
                    return reject("Server Error");
                }
            });
        });
      };

      export const getUserByPolicieId = (policiesId) => {
        return new Promise((resolve, reject) => {
            request.get("http://www.mocky.io/v2/580891a4100000e8242b75c5", function(err, res, body) { 
                if (!err && res.statusCode === 200) {
                    // process input
                    let policiesParsed = JSON.parse(body);
                    let policie = _.find(policiesParsed.policies, {'id': policiesId});
                    if (policie){
                        return resolve(policie);
                    }
                    else{
                        return reject("Policies doesn't exist");
                    }
                }
                 else{
                    return reject("Server Error");
                }
            });
        });
      };

     