var express = require('express');
var app = express();
var ejs = require('ejs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost/RajHack')
var location = new mongoose.Schema({
	name: String,
	area: String,
	lat: String,
	lon: String,
	rating: Number,
	type: String,
	info: String
});

var Obj =mongoose.model('location', location );
app.use(express.static('public'));
app.set("view engine", "ejs");

var mainObject;

app.post('/select', function(req, res){
	console.log(req.body);
	// var city = giveCity(req.body.location);
	var code = giveCode(req.body.location);
	// var code = giveCode(city);
	// var response = getData(code, req.body.type);
	var type = req.body.type;

	var options = { method: 'GET',
	  url: 'https://api.sygictravelapi.com/1.0/en/places/list',
	  qs: { parents: code, categories: type, limit: '10' },
	  headers: 
	   { 'postman-token': '6c95dcc0-df2c-fdef-1c53-cfd0894f0c81',
	     'cache-control': 'no-cache',
	     'x-api-key': '6gABUu5pDeafhlgldOFXP2d4d9oT9rvH3gRDOb5Q' } };

	request(options, function (error, response, body) {
	  if (error) throw new Error(error);

	  var response = JSON.parse(body);
	  
	  mainObject = response.data.places;
	  fs.writeFileSync('temp.json',JSON.stringify(response.data.places));
	  res.render("select", {
			obj: response.data.places
		});
	});
	console.log(code);
	console.log(type);
	
	// res.send(response);
});

app.post('/final', function(req, res){
	// var array = [{name: 'First', info: 'First-info'}, {name: 'Second', info: 'Second-info'}, {name: 'Third', info: 'Third-info'}, {name: 'Third', info: 'Third-info'}];
	var tagline = "This is Tourism";
	// res.render('third', {
	// 	obj: array,
	// 	tagline: tagline
	// });
	var names = req.body.selected;
	names = JSON.parse(names);
	console.log(names);
	var coords = shortestRoute(names);
	var data1 = getShortest(coords, names);
	console.log(data1);
	res.render('third',{
		obj: data1,
		tagline: "Optimal path for the destinations is as follows"
	});
});

app.listen(8000, function(){
	console.log('Listening on 8000');
});
// ===========================================================================================





















var buf = fs.readFileSync("data.json", "utf8");
var citycodes = JSON.parse(buf);


var giveCity = function(str){
	var temp="";
	for(var i=str.length-1;i>0;--i){
		if(str[i]!=","){
			temp = str[i] + temp;
		}else
			break;
	}
	return temp;
}

var giveCode = function(str){
	for(var i=0;i<citycodes.length;++i){
		if(citycodes[i].name==str){
			return citycodes[i].id;
		}
	}
	return -1;
}



var request = require("request");

var getData = function(code,type){
	var options = { method: 'GET',
	  url: 'https://api.sygictravelapi.com/1.0/en/places/list',
	  qs: { parents: code, categories: type, limit: '11' },
	  headers: 
	   { 'postman-token': '6c95dcc0-df2c-fdef-1c53-cfd0894f0c81',
	     'cache-control': 'no-cache',
	     'x-api-key': '6gABUu5pDeafhlgldOFXP2d4d9oT9rvH3gRDOb5Q' } };

	request(options, function (error, response, body) {
	  if (error) throw new Error(error);

	  // console.log(body);
	  setTimeout(function(){
	  	return body;
	  }, 1500);
	});
	console.log(code);
	console.log(type);
}

var shortestRoute = function(names){
	var mainObject = fs.readFileSync('temp.json',  "utf8");
	mainObject = JSON.parse(mainObject);
	var coords = [];
	for(var i=0;i<names.length;++i){
		for(var j=0;j<mainObject.length;++j){
			// console.log(mainObject[j].name + " " + names[i]);
			if(mainObject[j].name==names[i]){
				console.log(names[i] + " " + mainObject[j].location.lat + " " + mainObject[j].location.lng);
				coords.push({
					lat: mainObject[j].location.lat,
					lon: mainObject[j].location.lng
				});
			}
		}
	}
	return coords;
}

var jsgraphs = require('js-graph-algorithms');
var geolib = require('geolib');

var getShortest = function(array, names){
	var size = array.length;
	var g = new jsgraphs.WeightedGraph((size*(size-1))/2);
	 
	for(var i=0;i<size;++i){
		for(var j=0;j<size;++j){
			if(1){
				console.log(i + " " + j + " " + geolib.getDistance(
				    {latitude: array[i].lat, longitude: array[i].lon},
				    {latitude: array[j].lat, longitude: array[j].lon}
				));
				g.addEdge(new jsgraphs.Edge(i, j, geolib.getDistance({latitude: array[i].lat, longitude: array[i].lon},{latitude: array[j].lat, longitude: array[j].lon})));

			}
		}
	}

	// g.addEdge(new jsgraphs.Edge(0, 7, 0.16));

	 
	var kruskal = new jsgraphs.KruskalMST(g); 
	var mst = kruskal.mst;
	var answer = [];
	for(var i=0; i < mst.length; ++i) {
	    var e = mst[i];
	    var v = e.either();
	    var w = e.other(v);
	    // console.log('(' + v + ', ' + w + '): ' + e.weight);
	    answer.push({
	    	v1: v,
	    	v2: w,
	    	weight: e.weight
	    });
	}
	var hash = [];
	var used = [];
	var visited = [];
	for(var i=0;i<size;++i){
		hash.push(0);
		visited.push(0);
	}
	for(var i=0;i<answer.length;++i){
		hash[answer[i].v1]++;
		hash[answer[i].v2]++;
		used.push(0);
	}
	console.log(hash);
	var starting;
	for(var i=0; i<hash.length;++i){
		if(hash[i]==1){
			starting=i;
			break;
		}
	}
	var temp=starting;
	var path=[starting];
	visited[starting]=1;
	for(var i=0;i<answer.length;){
		var flag=0;
		for(var j=0;j<answer.length;++j){
			if(used[j]==0 && answer[j].v1==temp){
				path.push(answer[j].v2);
				temp = answer[j].v2;
				used[j]=1;
				visited[temp]=1;
				flag=1;
				++i;
			}else if(used[j]==0 && answer[j].v2==temp){
				path.push(answer[j].v1);
				temp = answer[j].v1;
				++i;
				used[j]=1;
				visited[temp]=1;
				flag=1;
			}	
		}
		if(flag==0){
			for(var j=0;j<visited.length;++j){
				if(visited[j]!=1){
					temp = j;
					path.push(temp);
					visited[temp]=1;
					break;
				}
			}
		}
	}
	console.log("Path" +  path);
	var route = [];
	var mainObject = fs.readFileSync('temp.json',  "utf8");
	mainObject = JSON.parse(mainObject);
	for(var i=0;i<path.length;++i){
		for(var j=0;j<mainObject.length;++j){
			if(mainObject[j].name == names[path[i]]){
				route.push({
					name: mainObject[j].name,
					info: mainObject[j].perex,
					data: mainObject[j]
				});
				break;
			}
		}
	}
	// console.log(route);
	return route;
}