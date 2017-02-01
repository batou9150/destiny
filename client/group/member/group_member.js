import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './group_member.html';

Template.GroupMemberSingle.helpers({
  groupMemberSingle: function () {
    return Template.instance().asyncGroupMemberSingle.get();
  }
});

Template.GroupMemberSingle.onCreated(function () {
	this.asyncGroupMemberSingle = new ReactiveVar("Loading");
	var self = this;
	Meteor.call('getUserBungieAccount', this.data.membershipId, function (err, res) {
		if (err) {
			self.asyncGroupMemberSingle.set({error: err});
		} else {
			self.asyncGroupMemberSingle.set(res);
			console.log('asyncGroupMemberSingle', res);
			return res;
		}
	});
});


Template.GroupMembers.helpers({
  GroupMemberResults: function () {
    return Template.instance().asyncGroupMemberResults.get();
  },
  HasMore: function () {
    return Template.instance().asyncHasMore.get();
  }
});

Template.GroupMembers.onCreated(function() {
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
			console.log('asyncGroupMemberResults', res.Response);
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
					console.log('asyncGroupMemberResults', res.Response);
					return res;
				}
			});
		}
	});
});

Template.GroupMembers.events({
  'click .moreGroupMemberResults': function (evt, tpl) {
    console.log('GroupMembers.events.click.moreGroupMemberResults : ', tpl);
    var self = tpl;
    self.pageId += 1;
	Meteor.call('getGroupMembers', self.groupId, self.pageId, function (err, res) {
		if (err) {
			self.asyncGroupMemberResults.push({error: err});
		} else {
			self.asyncGroupMemberResults.pushArray(res.Response.results);
			self.asyncHasMore.set(res.Response.hasMore);
			console.log('asyncGroupMemberResults', res.Response);
			return res;
		}
	});
  }
});