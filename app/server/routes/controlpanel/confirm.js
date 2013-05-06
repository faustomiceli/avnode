var http = require('http');
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
var DB = require('../../modules/db-manager');
var functions = require('../../modules/functions');

exports.get = function get(req, res) {
	if (req.query.code) {
		DB.temp.findOne({code:req.query.code}, function(e, result) {
			if (result) {
				console.dir(result);
				if (result.act == "password") {
					console.dir(result);
					DB[result.collection].findOne({_id:new ObjectID(result.doc_id)}, function(e, result2) {
						if (result2) {
					  		for(item in result.data) {
					  			result2[item] = result.data[item];
					  		}
					  		DB[result.collection].save(result2, {safe:true}, function(e, success) {
					  			if (success) {
							  		var msg = {c:[{m:result.msg.text}]};
							  		DB.temp.remove({code:req.query.code});
					  			} else {
							  		var msg = {e:[{m:"Code is not valid or already used"}]};
					  			}
								res.render('forms/confirm', {	locals: {title : result.msg.title, msg:msg, "from":req.query.from}, user : req.session.user });
					  		});
						} else {
							var msg = {e:[{m:"Code is not valid or already used"}]};
							res.render('forms/confirm', {	locals: {title : result.msg.title, msg:msg, "from":req.query.from}, user : req.session.user });
						}
					});
				} else if (result.act == "newmail") {
					DB[result.collection].findOne({_id:new ObjectID(result.doc_id)}, function(e, result2) {
				  		for(item in result.data) {
					  		for(item2 in result2.emails) {
					  			if (result2.emails[item2].email == result.data[item]) {
						  			result2.emails[item2].valid = 1;
					  			}
					  		}
				  		}
				  		DB[result.collection].save(result2, {safe:true}, function(e, success) {
				  			if (success) {
						  		var msg = {c:[{m:result.msg.text}]};
						  		DB.temp.remove({code:req.query.code});
				  			} else {
						  		var msg = {e:[{m:"Code is not valid or already used"}]};
				  			}
							res.render('forms/confirm', {	locals: {title : result.msg.title, msg:msg, "from":req.query.from}, user : req.session.user });
				  		});
					});
				}
			} else {
				var msg = {e:[{m:"Code is not valid or already used"}]};
				res.render('forms/confirm', {	locals: {title : __("Code confirm"), msg:msg, "from":req.query.from}, user : req.session.user });
			}
		});
	} else {
		res.render('forms/confirm', {	locals: {title : "Login", "from":req.query.from}, user : req.session.user });
	}
}
