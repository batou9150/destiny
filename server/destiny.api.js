import { Meteor } from 'meteor/meteor';

destiny = {};
destiny.url = 'https://www.bungie.net/platform';
destiny.api_key = Meteor.settings.bungie.api_key;


var apiCall = function (type, apiUrl, data, callback) {
  // try…catch allows you to handle errors 
  try {
  	var options = {
  		headers:{
    		'X-API-Key':destiny.api_key
    		}
    	};
    if(type == 'POST') options['data'] = data;
    var response = HTTP.call(type, apiUrl, options).data;
    // A successful API call returns no error 
    // but the contents from the JSON response
    callback(null, response);
  } catch (error) {
    // If the API responded with an error message and a payload 
    if (error.response) {
      var errorCode = error.response.data.code;
      var errorMessage = error.response.data.message;
    // Otherwise use a generic error message
    } else {
      var errorCode = 500;
      var errorMessage = 'Cannot access the API';
    }
    // Create an Error object and return it via callback
    var myError = new Meteor.Error(errorCode, errorMessage);
    callback(myError, null);
  }
};

var getApiUrl = function (path, params) {
	params_string = '';
	for(param in params){
		value = params[param];
		if(value !== null && value !== undefined && value !== ''){
			if(params_string==''){
				params_string = '?'
			}
			else{
				params_string = params_string + "&";
			}
			params_string += param+'='+value;
		}
	}
	console.log(destiny.url+path+params_string);
	return destiny.url+path+params_string;
};

Meteor.methods({
// ----------------------------------------- Core -----------------------------------------
	// Hello World
	'helloWorld': function () {
		console.log('Method.helloWorld');
		this.unblock();
		var apiUrl = getApiUrl('/HelloWorld/');
		return Meteor.wrapAsync(apiCall)('GET', apiUrl, null);
	},
// ----------------------------------------- Group -----------------------------------------
	// Group Search
	'getGroupSearch': function (query) {
		console.log('Method.getGroupSearch for', query);
		this.unblock();
		var apiUrl = getApiUrl('/Group/Search/');
		var data = {contents:{searchValue:query, searchType:0}, currentPage:1, itemsPerPage: 100};
		return Meteor.wrapAsync(apiCall)('POST', apiUrl, data);
	},
	// Group Detail
	'getGroupDetail': function (group_id) {
		console.log('Method.getGroupDetail for', group_id);
		this.unblock();
		var apiUrl = getApiUrl('/Group/'+group_id+'/');
		var data = null;
		return Meteor.wrapAsync(apiCall)('GET', apiUrl, data);
	},
	// Group Members
	'getGroupMembers': function (group_id, page_id) {
		console.log('Method.getGroupMembers for', group_id, page_id);
		this.unblock();
		var apiUrl = getApiUrl('/Group/'+group_id+'/ClanMembers/', {currentPage:page_id, platformType:1});
		var data = null;
		return Meteor.wrapAsync(apiCall)('GET', apiUrl, data);
	},
// ----------------------------------------- User -----------------------------------------
	// User Bungie Account
	'getUserBungieAccount': function (membership_id) {
		console.log('Method.getUserBungieAccount for', membership_id);
		this.unblock();
		var apiUrl = getApiUrl('/User/GetBungieAccount/'+membership_id+'/1/');
		var data = null;
		return Meteor.wrapAsync(apiCall)('GET', apiUrl, data);
	},
// ----------------------------------------- Destiny -----------------------------------------
	// Destiny Manifest
	'getDestinyManifest': function () {
		console.log('Method.getDestinyManifest');
		this.unblock();
		var apiUrl = getApiUrl('/Destiny/Manifest/');
		var data = null;
		return Meteor.wrapAsync(apiCall)('GET', apiUrl, data);
	},
	// Character Summary
	'getCharacterSummary': function (membership_id, character_id) {
		console.log('Method.getCharacterSummary for', membership_id, character_id);
		this.unblock();
		var apiUrl = getApiUrl('/Destiny/1/Account/'+membership_id+'/Character/'+character_id);
		var data = null;
		return Meteor.wrapAsync(apiCall)('GET', apiUrl, data);
	},
	// Character
	'getCharacter': function (membership_id, character_id) {
		console.log('Method.getCharacter for', membership_id, character_id);
		this.unblock();
		var apiUrl = getApiUrl('/Destiny/1/Account/'+membership_id+'/Character/'+character_id+'/Complete/');
		var data = null;
		return Meteor.wrapAsync(apiCall)('GET', apiUrl, data);
	},
	// GetCharacterActivities
	'getCharacterActivities': function (membership_id, character_id) {
		console.log('Method.getCharacterActivities for', membership_id, character_id);
		this.unblock();
		var apiUrl = getApiUrl('/Destiny/1/Account/'+membership_id+'/Character/'+character_id+'/Activities/');
		var data = null;
		return Meteor.wrapAsync(apiCall)('GET', apiUrl, data);
	}
})