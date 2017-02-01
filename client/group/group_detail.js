import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './group_detail.html';

Template.GroupDetail.onCreated(function() {
	this.groupId = FlowRouter.getParam('group_id');
	Meteor.call('getGroupDetail', this.groupId, function (err, res) {
	if (err) { 
		Session.set('GroupDetailResult', {error: err});
	} else {
		Session.set('GroupDetailResult', res);
		console.log('GroupDetailResult', res);
		return res;
	}
	});

	this.reactive_var = new ReactiveVar(false);

	this.autorun(() => {
		if (this.groupId !== FlowRouter.getParam('group_id')) {
			this.reactive_var.set(false);
			this.groupId = FlowRouter.getParam('group_id');
			Meteor.call('getGroupDetail', this.groupId, function (err, res) {
			if (err) { 
				Session.set('GroupDetailResult', {error: err});
			} else {
				Session.set('GroupDetailResult', res);
				console.log('GroupDetailResult', res);
				return res;
			}
			});
		}
	});
});

Template.GroupDetail.helpers({
  GroupDetailResult: function () {
    return Session.get('GroupDetailResult');
  }
});