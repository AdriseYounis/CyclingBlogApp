/**
 * Created by Adries on 24/04/2016.
 */

describe('A file',function(){

    var request = require('request');
    var app = require("../app.js");
    var url = "http://localhost:3000/";

    //logging in before we can actually run a test
    var bearerToken;

    var loginToken = {auth: {'bearer' : bearerToken}};

    beforeEach(function(done){
        request.post(url + 'login',
            {form:{email:"younisa2@aston.ac.uk", password: "123"}}, function(error, response, body){

                bearerToken = body;
                done(); //used for async test
            });
    });

    //authentication test
    describe('test authentication', function(){
       it('Should login the user', function(done){
           request.post(url + 'login',
               {form:{email:"younisa2@aston.ac.uk", password: "123"}}, function(error, response, body){

                   expect(response.statusCode).toBe(200);
                   done(); //used for async test
               });
       })
    });

    //Testing the correct route is returned
    describe('Testing if a cycling route is retrieved', function(){
        it('Should return a route', function(done){
            request.get(url + 'routes/571f3867dfb7021e22cffe0d', function(error, response, body){
                    var parse = JSON.parse(body);
                    expect(parse._id).toBe("571f3867dfb7021e22cffe0d");
                    expect(parse.routename).toBe("20110629ToAston-1.kmz");
                    done(); //used for async test
                });
        })
    });

    describe('Testing if a particular blog is retrieved', function(){
        it('Should return a blog', function(done){
            request.get(url + 'posts/571f38a1dfb7021e22cffe0f', function(error, response, body){
                var parse = JSON.parse(body);
                expect(parse._id).toBe("571f38a1dfb7021e22cffe0f");
               expect(parse.title).toBe("Test Blog");
                done(); //used for async test
            });
        })
    });

    describe('the route which return a certain blog with the assoicated', function(){
        it('Should get the first comment for a blog', function(done){
            request.get(url + 'posts/571f38a1dfb7021e22cffe0f', function(error, response, body){
                var parse = JSON.parse(body);
                expect(parse._id).toBe("571f38a1dfb7021e22cffe0f");
                expect(parse.comments[0].body).toBe("i ike the video");

                done(); //used for async test
            });
        })
    });


});