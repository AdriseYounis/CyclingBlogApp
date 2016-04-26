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
            request.get(url + 'routes/571c586fb65c605f08203e1b', function(error, response, body){
                    var parse = JSON.parse(body);
                    expect(parse._id).toBe("571c586fb65c605f08203e1b");
                    expect(parse.routename).toBe("20110425Nottingham to Lichfield.gpx");
                    done(); //used for async test
                });
        })
    });

    //describe('Testing if a particular blog is retrieved', function(){
    //    it('Should return a blog', function(done){
    //        request.get(url + 'post', function(error, response, body){
    //            var parse = JSON.parse(body);
    //            expect(parse._id).toBe("571c05d592395f6203f50e39");
    //
    //           // expect(parse.title).toBe("Aston University to Aston Villa");
    //
    //            done(); //used for async test
    //        });
    //    })
    //})

});