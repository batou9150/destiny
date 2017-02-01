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
	}

	return res;
}

Template.GroupCharacterStatsSingle.onCreated(function () {
	this.asyncGroupCharacterSingle = new ReactiveVar("Loading");
	var self = this;
	var membershipId = this.data.destinyAccount.userInfo.membershipId;
	var characterId = this.data.character.characterId;
	Meteor.call('getCharacterActivities', membershipId, characterId, function (err, res) {
		if (err) {
			self.asyncGroupCharacterSingle.set({error: err});
		} else {
			res = getRaids(res.Response.data);
			self.asyncGroupCharacterSingle.set(res);
			// console.log('asyncGroupCharacterSingle', res);
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