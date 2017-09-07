import express from 'express';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import exphbs from 'express-handlebars';
import path from 'path';

class Express {
    constructor(){
        this.app = express();
        this.route = express.Router();
    }

    initMiddleware(){
        // this.app.set()

        this.app.engine('.hbs', exphbs({
            defaultLayout: 'layout',
            extname: '.hbs'
        }));

        this.app.set('views', path.join(__dirname, '/../views'));
    
        this.app.set('view engine', '.hbs');

        // Request body parsing middleware
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());      
        this.app.use(session({
            secret: 'FOO_FIGTHERS',
            resave: true,
            saveUninitialized: true
        }));  
        this.app.use(flash());

        this.app.use('/js', express.static('./node_modules/bootstrap/dist/js')); // redirect bootstrap JS
        this.app.use('/js', express.static('./node_modules/jquery/dist')); // redirect JS jQuery
        this.app.use('/css', express.static('./node_modules/bootstrap/dist/css')); // Redirect CSS bootstrap
    
    }


    init(){
        //Init express Middleware
        this.initMiddleware();

        return this.app;
    }
}

export default new Express();