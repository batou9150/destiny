import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './group_search.html';

Template.GroupSearch.onCreated(function() {
	this.query = FlowRouter.getParam('query');
	Meteor.call('getGroupSearch', this.query, function (err, res) {
	if (err) { 
		Session.set('GroupSearchResults', {error: err});
	} else {
		Session.set('GroupSearchResults', res);
		console.log('GroupSearchResults', res);
		return res;
	}
	});

	this.reactive_var = new ReactiveVar(false);

	this.autorun(() => {
		if (this.query !== FlowRouter.getParam('query')) {
			this.reactive_var.set(false);
			this.query = FlowRouter.getParam('query');
			Meteor.call('getGroupSearch', this.query, function (err, res) {
			if (err) { 
				Session.set('GroupSearchResults', {error: err});
			} else {
				Session.set('GroupSearchResults', res);
				console.log('GroupSearchResults', res);
				return res;
			}
			});
		}
	});
});

Template.GroupSearch.helpers({
  GroupSearchResults: function () {
    return Session.get('GroupSearchResults');
  }
});