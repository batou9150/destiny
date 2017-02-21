import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Weapons } from '../../../api/destiny.manifest.js';

import './group_exo.html';

Template.GroupExo.onCreated(function() {
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
				// console.log('GroupDetailResult', res);
				return res;
			}
			});
		}
	});
});

Template.GroupExo.helpers({
  GroupDetailResult: function () {
    return Session.get('GroupDetailResult');
  }
});


Template.GroupMemberExo.helpers({
  GroupMemberResults: function () {
    return Template.instance().asyncGroupMemberResults.get();
  },
  HasMore: function () {
    return Template.instance().asyncHasMore.get();
  },
  exotics: function () {
	/*
	9 -> Revolver
	6 -> Fusil automatique
	13 -> Fusil à impulsion
	14 -> Fusil d'éclaireur

	7 -> Fusil à pompe
	11 -> Fusil à fusion
	12 -> Fusil de précision
	17 -> Pistolet

	8 -> Mitrailleuse
	10 -> Lance-roquettes
	18 -> Épée
	*/
	var filter = null;
  	if(Template.instance().exoType.get() == 'principales')
  		// filter = {itemSubType:{$in:[6,9,13,14]}};
  		filter = {'weapons.bucketTypeHash':1498876634};
  	else if(Template.instance().exoType.get() == 'speciales')
  		// filter = {itemSubType:{$in:[7,11,12,17]}};
  		filter = {'weapons.bucketTypeHash':2465295065};
  	else if(Template.instance().exoType.get() == 'lourdes')
  		// filter = {itemSubType:{$in:[8,10,18]}};
  		filter = {'weapons.bucketTypeHash':953998645};
  	else
  		filter = {};
    return Weapons.find(filter, {sort:{'weapons.bucketTypeHash':1, itemSubType:1}}).fetch();
  }
});

Template.GroupMemberExo.onCreated(function() {
	this.groupId = FlowRouter.getParam('group_id');
	this.exoType = new ReactiveVar(FlowRouter.getParam('exo_type'));
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
		} else if (this.exoType != FlowRouter.getParam('exo_type')){
			this.exoType.set(FlowRouter.getParam('exo_type'));
		}
	});
});

Template.GroupMemberExo.events({
  'click .moreGroupMemberResults': function (evt, tpl) {
    console.log('GroupMemberExo.events.click.moreGroupMemberResults : ', tpl);
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

Template.GroupMemberExoSingle.helpers({
	weapons: function () {
		var _weapons = Template.instance().asyncWeapons.get();
		if(_weapons == 'Loading') return _weapons;
		_weapons['exotics'] = Template.instance().data.exotics;
		_weapons['total_exotics'] = _weapons['nb_exotics'] = 0;
		for(var e = 0; e < _weapons['exotics'].length; e++){
			_weapons['exotics'][e]['completed'] = false;
			for(var g = 0; g < _weapons.cardCollection.length; g++){
				var _card = _weapons.cardCollection[g];
				if(_weapons['exotics'][e]['cardId'] == _card.cardId){
					_weapons['exotics'][e]['completed'] = true;
					_weapons['nb_exotics'] += 1;
				}
			}
			if(_weapons['exotics'][e]['itemHash'] != 3688594190
				&& _weapons['exotics'][e]['itemHash'] != 3490486524
				&& _weapons['exotics'][e]['itemHash'] != 310074617){
				_weapons['total_exotics'] += 1;
			}
		}
		_weapons['ratio'] = Math.floor(100 * _weapons['nb_exotics'] / (_weapons['total_exotics']));
		return _weapons;
	}
});

Template.GroupMemberExoSingle.onCreated(function () {
	this.asyncGroupMemberSingle = new ReactiveVar("Loading");
	this.asyncWeapons = new ReactiveVar("Loading");
	var self = this;
	Meteor.call('getGrimoireByMembership', this.data.GroupMemberResult.membershipId, function (err, res) {
		if (err) {
			self.asyncCharacterProgession.set({error: err});
		} else {
			self.asyncWeapons.set(res.Response.data);
			// console.log('grimoire', res.Response.data);
			return res;
		}
	});
});