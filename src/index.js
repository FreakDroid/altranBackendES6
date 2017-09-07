// 'use strict';

import open from 'open';

import AuthLocal from './auth-local';
import expressConfig from './expressConfig';
import express from 'express';
import passport from 'passport';
import webpack from 'webpack';
import config from '../webpack.config.dev';

/* eslint-disable no-console */

export const server = () =>{
    const port = 5050;

        // Initialize express
        const app = expressConfig.init();
        AuthLocal.initialize(app);
    
        const router = AuthLocal.router();
        app.use(router);
    
        const compiler = webpack(config);
        
        app.use(require('webpack-dev-middleware')(compiler, {
          noInfo: true,
          publicPath: config.output.publicPath
        }));
        
        app.use(require('webpack-hot-middleware')(compiler));
    
        app.listen(port, function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log(`Server running at http://localhost:${port}`);
              open(`http://localhost:${port}/login`);
            }
          });
};