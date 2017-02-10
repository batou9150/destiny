import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './member_raids.html';

Template.GroupCharacterStatsSingle.helpers({
	xboxDisplayName:function(){
		return Template.instance().data.bungieNetUser.xboxDisplayName;
	},
	grimoireScore:function(){
		return Template.instance().data.destinyAccount.grimoireScore;
	},
	character:function(){
		return Template.instance().data.character;
	},
	quests: function () {
		return Template.instance().asyncCharacterQuests.get();
	},
	pic: function () {
		return Template.instance().asyncCharacterPic.get();
	},
	raids: function () {
		return Template.instance().asyncGroupCharacterSingle.get();
	},
	nbRaidCompleted: function () {
		var _nbRaidCompleted = 0;
		var _raids = Template.instance().asyncGroupCharacterSingle.get();
		if(_raids.CV_26 != null && _raids.CV_26.isCompleted) _nbRaidCompleted++;
		if(_raids.CV_30 != null && _raids.CV_30.isCompleted) _nbRaidCompleted++;
		if(_raids.CC_30 != null && _raids.CC_30.isCompleted) _nbRaidCompleted++;
		if(_raids.CC_33 != null && _raids.CC_33.isCompleted) _nbRaidCompleted++;
		if(_raids.CR != null && _raids.CR.isCompleted) _nbRaidCompleted++;
		if(_raids.CR_HARD != null && _raids.CR_HARD.isCompleted) _nbRaidCompleted++;
		if(_raids.FM != null && _raids.FM.isCompleted) _nbRaidCompleted++;
		if(_raids.FM_HARD != null && _raids.FM_HARD.isCompleted) _nbRaidCompleted++;
		return _nbRaidCompleted;
	}
});

var getQuests = function(data){
	var res = {};
	res["ALL"] = [];
	for(var i=0; i < data.buckets.Invisible.length; i++){
		var progression = data.buckets.Invisible[i];
		if(progression.bucketHash == 2020263354){
			res["PIC"] = progression;
		}
		else if(progression.bucketHash == 2155266255){
			res["APP"] = progression;
		}
		else if(progression.bucketHash == 1256644900){
			res["TEST"] = progression;
		}
		else if(progression.bucketHash == 1801258597){
			res["Quest"] = progression;
		}
		else{
			res["ALL"].push(progression.bucketHash);
		}
	}
	return res;
}

var getWeapons = function(data){
	var res = [];
	for(var i=0; i < data.buckets.Equippable.length; i++){
		if(data.buckets.Equippable[i].bucketHash == 1498876634 // BUCKET_PRIMARY_WEAPON
			|| data.buckets.Equippable[i].bucketHash == 2465295065 // BUCKET_SPECIAL_WEAPON
			|| data.buckets.Equippable[i].bucketHash == 953998645 // BUCKET_HEAVY_WEAPON
			|| data.buckets.Equippable[i].bucketHash == 4046403665 // BUCKET_VAULT_WEAPONS
			)
			for(var j = 0; j < data.buckets.Equippable[i].items.length; j++)
				res.push(data.buckets.Equippable[i].items[j]);
	}
	return res;
}

var getPic = function(weapons){
	if(Array.isArray(weapons))
		for(var i = 0; i < weapons.length; i++){
			if(weapons[i].itemHash == 3742521821) return weapons[i];
		}
	return null;
}

var getRaids = function(data){
	var res = {};
	for(var i=0; i < data.available.length; i++){
		var activity = data.available[i];
		// Le Caveau de verre
		if(activity.activityHash == 2659248071){
			res["CV_26"] = activity;
		}
		else if(activity.activityHash == 2659248068){
			res["CV_30"] = activity;
		}
		else if(activity.activityHash == 2659248069){
			res["CV_31"] = activity;
		}
		// La chute de Cropta
		else if(activity.activityHash == 1836893116){
			res["CC_30"] = activity;
		}
		else if(activity.activityHash == 1836893119){
			res["CC_33"] = activity;
		}
		// La Chute du roi
		else if(activity.activityHash == 1733556769){
			res["CR"] = activity;
		}
		else if(activity.activityHash == 3534581229){
			res["CR_HARD"] = activity;
		}
		// Fureur mécanique
		else if(activity.activityHash == 260765522){
			res["FM"] = activity;
		}
		else if(activity.activityHash == 1387993552){
			res["FM_HARD"] = activity;
		}
		else if(activity.activityHash == 1387993552){
			res["FM_HARD"] = activity;
		}
	}

	return res;
}

var getRecordBooks = function(data){
	var res = [];
	for(var i=0; i < data.progressions.length; i++){
		var progression = data.progressions[i];
		if(progression.progressionHash == 3433868304){
			res['rise_of_iron'] = progression;
		}
	}
	return res;
}

var getPicGrimoreCard = function(data){
	for(var i=0; i < data.cardCollection.length; i++){
		var card = data.cardCollection[i];
		if(card.cardId == 800401){
			return true;
		}
	}
	return false;
}

Template.GroupCharacterStatsSingle.onCreated(function () {
	this.asyncGroupCharacterSingle = new ReactiveVar("Loading");
	this.asyncCharacterItems = new ReactiveVar("Loading");
	this.asyncCharacterQuests = new ReactiveVar("Loading");
	this.asyncCharacterWeapons = new ReactiveVar("Loading");
	this.asyncCharacterPic = new ReactiveVar(false);
	this.asyncCharacterProgession = new ReactiveVar(false);
	var self = this;
	var membershipId = this.data.destinyAccount.userInfo.membershipId;
	var characterId = this.data.character.characterId;
	Meteor.call('getCharacterActivities', membershipId, characterId, function (err, res) {
		if (err) {
			self.asyncGroupCharacterSingle.set({error: err});
		} else {
			// console.log('asyncGroupCharacterSingle', res);
			res = getRaids(res.Response.data);
			self.asyncGroupCharacterSingle.set(res);
			return res;
		}
	});
/*
	Meteor.call('getCharacterInventory', membershipId, characterId, function (err, res) {
		if (err) {
			self.asyncCharacterItems.set({error: err});
		} else {
			// if(self.data.bungieNetUser.xboxDisplayName != 'Batoucada') return null;
			self.asyncCharacterItems.set(res);
			res = getWeapons(res.Response.data);
			self.asyncCharacterWeapons.set(res);
			res = getPic(res);
			self.asyncCharacterPic.set(res);
			return res;
		}
	});
*/
	Meteor.call('getGrimoireByMembership', membershipId, function (err, res) {
		if (err) {
			self.asyncCharacterProgession.set({error: err});
		} else {
			res = getPicGrimoreCard(res.Response.data);
			self.asyncCharacterPic.set(res);
			return res;
		}
	});
});

Template.GroupMemberStatsSingle.helpers({
  groupMemberSingle: function () {
  	return Template.instance().asyncGroupMemberSingle.get();
  }
});

Template.GroupMemberStatsSingle.onCreated(function () {
	this.asyncGroupMemberSingle = new ReactiveVar("Loading");
	var self = this;
	Meteor.call('getUserBungieAccount', this.data.membershipId, function (err, res) {
		if (err) {
			self.asyncGroupMemberSingle.set({error: err});
		} else {
			self.asyncGroupMemberSingle.set(res);
			// console.log('asyncGroupMemberSingle', res);
			return res;
		}
	});
});


Template.GroupMemberStats.helpers({
  GroupMemberResults: function () {
    return Template.instance().asyncGroupMemberResults.get();
  },
  HasMore: function () {
    return Template.instance().asyncHasMore.get();
  }
});

Template.GroupMemberStats.onCreated(function() {
	this.groupId = FlowRouter.getParam('group_id');
	this.pageId = 1;
	this.asyncGroupMemberResults = new ReactiveArray();
	this.asyncHasMore = new ReactiveVar(false);
	var self = this;
	Meteor.call('getGroupMembers', this.groupId, this.pageId, function (err, res) {
		if (err) {
			self.asyncGroupMemberResults.push({error: err});
		} else {
			self.asyncGroupMemberResults.pushArray(res.Response.results);
			self.asyncHasMore.set(res.Response.hasMore);
			// console.log('asyncGroupMemberResults', res.Response);
			return res;
		}
	});

	this.autorun(() => {
		if (this.groupId !== FlowRouter.getParam('group_id')) {
			this.groupId = FlowRouter.getParam('group_id');
			this.pageId = 1;
			Meteor.call('getGroupMembers', this.groupId, this.pageId, function (err, res) {
				if (err) {
					self.asyncGroupMemberResults.push({error: err});
				} else {
					self.asyncGroupMemberResults.pushArray(res.Response.results);
					self.asyncHasMore.set(res.Response.hasMore);
					// console.log('asyncGroupMemberResults', res.Response);
					return res;
				}
			});
		}
	});
});

Template.GroupMemberStats.events({
  'click .moreGroupMemberResults': function (evt, tpl) {
    console.log('GroupMemberStats.events.click.moreGroupMemberResults : ', tpl);
    var self = tpl;
    self.pageId += 1;
	Meteor.call('getGroupMembers', self.groupId, self.pageId, function (err, res) {
		if (err) {
			self.asyncGroupMemberResults.push({error: err});
		} else {
			self.asyncGroupMemberResults.pushArray(res.Response.results);
			self.asyncHasMore.set(res.Response.hasMore);
			// console.log('asyncGroupMemberResults', res.Response);
			return res;
		}
	});
  }
});