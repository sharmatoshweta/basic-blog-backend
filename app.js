var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var shortid = require('shortid');
const fs = require('fs');
var cresponse = {
    error: 'true',
    message: "Some error message",
    status: 000,
    data: null
};

app.use(bodyParser.json({
    limit: '10mb'
}));

app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));

app.use(bodyParser.text({
    limit: '10mb',
    extended: true
}));

require('./models/blog.js')
var blogModel = mongoose.model('Blog');

var dbPath = "mongodb://localhost/my-blog";

// command to connect with database
db = mongoose.connect(dbPath);

mongoose.connection.on('error', function (err) {
    console.log('database connection error');
    console.log(err)
    //process.exit(1)
}); // end mongoose connection error

mongoose.connection.on('open', function (err) {

    if (err) {
        console.log("database error");
        console.log(err);
        logger.error(err, 'mongoose connection open handler', 10)
    } else {
        console.log("database connection open success");
    }
    //process.exit(1)

}); // enr mongoose connection open handler




// application level middleware for setting time in request.
app.use(function (req, res, next) {

    var today = Date.now();
    req.body.timeOfCreation = today;
    next();

}); // end of application middleware.


// API to get all blogs.
app.get('/blog/all', function (req, res) {

    blogModel.find({
        status: true
    }, function (err, result) {

        console.log(result);

        if (err) {

            cresponse = {
                error: 'true',
                message: "Some error message",
                status: 500,
                data: null
            };

        } else if (result == undefined || result == null || result.length == 0) {

            cresponse = {
                error: 'true',
                message: "No blog found",
                status: 404,
                data: null
            };

        } else {

            cresponse = {
                error: 'false',
                message: "Request success",
                status: 200,
                data: result
            };

        }

        res.send(cresponse);
    })

}) // api to get blogs ends


// API to get blogs of a user.
app.get('/blog/all/:userId', function (req, res) {

    blogModel.find({
        userId: req.params.userId,
        status: true
    }, function (err, result) {

        console.log(result);

        if (err) {

            cresponse = {
                error: 'true',
                message: "Some error message",
                status: 500,
                data: null
            };

        } else if (result == undefined || result == null || result.length == 0) {

            cresponse = {
                error: 'true',
                message: "No blog found",
                status: 404,
                data: null
            };

        } else {

            cresponse = {
                error: 'false',
                message: "Request success",
                status: 200,
                data: result
            };

        }

        res.send(cresponse);
    })

}) // api to get blogs of a user ends


// API to get deleted blogs of a user.
app.get('/blog/all/deleted/:userId', function (req, res) {

    blogModel.find({
        userId: req.params.userId,
        status: false
    }, function (err, result) {

        console.log(result);

        if (err) {

            cresponse = {
                error: 'true',
                message: "Some error message",
                status: 500,
                data: null
            };

        } else if (result == undefined || result == null || result.length == 0) {

            cresponse = {
                error: 'true',
                message: "No blog found",
                status: 404,
                data: null
            };

        } else {

            cresponse = {
                error: 'false',
                message: "Request success",
                status: 200,
                data: result
            };

        }

        res.send(cresponse);
    })

}) // api to get deleted blogs of a user ends


// API to create a blog
app.post('/blog/create', function (req, res) {

    if (req.body.userId != null  && req.body.userId != ''  && req.body.userId != undefined  && req.body.blogHeading != null && req.body.blogHeading != '' && req.body.blogHeading != undefined) {

        var blogId = shortid.generate();

        var newblog = new blogModel({

            blogId: blogId,
            userId: req.body.userId,
            blogHeading: req.body.blogName,
            blogDescription: req.body.blogDescription,
            author: req.body.author,
            created: req.body.timeOfCreation,
            imageUrl: req.body.imageUrl,
            tags: (req.body.tags != undefined && req.body.tags != null) ? req.body.tags.split(',') : ''

        }); // end newblog creation

        newblog.save(function (err) { // we can also pass a response object here but the result will be same as variable value `newblog`. thats why we are not passing it.

            if (err) {

                console.log(err);
                cresponse = {
                    error: 'true',
                    message: "Some error message",
                    status: 500,
                    data: null
                };

            } else {
                cresponse = {
                    error: 'false',
                    message: "Request success",
                    status: 200,
                    data: newblog
                };
            }

            res.send(cresponse);

        }); //Completed newblog

    } else {
        cresponse = {
            error: 'true',
            message: "parameters missing",
            status: 422,
            data: null
        };
        res.send(cresponse);
    }

}) // API ends to create a blog


// API to get a blog by blog id
app.get('/blog/:blogId', function (req, res) {

    blogModel.findOne().where({
        'blogId': req.params.blogId
    }).exec(function (err, result) {
        if (err) {

            cresponse = {
                error: 'true',
                message: "Some error message",
                status: 500,
                data: null
            };

        } else if (result == undefined || result == null || result.length == 0) {

            cresponse = {
                error: 'true',
                message: "No blog found",
                status: 404,
                data: null
            };

        } else {

            cresponse = {
                error: 'false',
                message: "Request success",
                status: 200,
                data: result
            };

        }

        res.send(cresponse);
    })
}) // API ends of getting a blog with blog id.


// API to edit blog by blog id.
app.put('/blog/edit/:blogId', function (req, res) {

    req.body.lastModified = req.body.timeOfCreation;

    var update = req.body;    

    blogModel.findOneAndUpdate({
        'blogId': req.params.blogId
    }, update, function (err, result) {
        if (err) {

            cresponse = {
                error: 'true',
                message: "Some error message",
                status: 500,
                data: null
            };

        } else if (result == undefined || result == null || result.length == 0) {

            cresponse = {
                error: 'true',
                message: "No blog found",
                status: 404,
                data: null
            };

        } else {

            cresponse = {
                error: 'false',
                message: "Request success",
                status: 200,
                data: result
            };

        }

        res.send(cresponse);
    })
}) // APi ends of editing blog nby blog id.

// API to edit blog by blog id.
app.put('/blog/delete/:blogId', function (req, res) {

    console.log("in delete");

    var update = {
        status: false
    };

    blogModel.findOneAndUpdate({
        'blogId': req.params.blogId
    }, update, function (err, result) {
        if (err) {

            cresponse = {
                error: 'true',
                message: "Some error message",
                status: 500,
                data: null
            };

        } else if (result == undefined || result == null || result.length == 0) {

            cresponse = {
                error: 'true',
                message: "No blog found",
                status: 404,
                data: null
            };

        } else {

            cresponse = {
                error: 'false',
                message: "Request success",
                status: 200,
                data: result
            };

        }

        res.send(cresponse);
    })
}) // APi ends of deleting blog temporary


// API to delete a blog.
app.post('/blog/permanently/delete/:blogId', function (req, res) {

    blogModel.remove({
        'blogId': req.params.blogId
    }, function (err, result) {
        if (err) {

            cresponse = {
                error: 'true',
                message: "Some error message",
                status: 500,
                data: null
            };

        } else if (result == undefined || result == null || result.length == 0) {

            cresponse = {
                error: 'true',
                message: "No blog found",
                status: 404,
                data: null
            };

        } else {

            cresponse = {
                error: 'false',
                message: "Request success",
                status: 200,
                data: result
            };

        }

        res.send(cresponse);
    })
}) // API ends for deleting a blog with blog id.


// application middleware for unwanted get requests
app.get('*', function (req, res) {

    cresponse = {
        error: 'true',
        message: "I have not created this request",
        status: 404,
        data: null
    };

    res.send(cresponse);

}) // end of applicatiion middleware.

// application middleware for unwanted post requests
app.post('*', function (req, res) {

    cresponse = {
        error: 'true',
        message: "I have not created this request",
        status: 404,
        data: null
    };

    res.send(cresponse);

}) // end of applicatiion middleware.

// application middleware for unwanted put requests
app.put('*', function (req, res) {

    cresponse = {
        error: 'true',
        message: "I have not created this request",
        status: 404,
        data: null
    };

    res.send(cresponse);

}) // end of applicatiion middleware.







app.listen(4000, function () {
    console.log('Example app listening on port 4000!');
});