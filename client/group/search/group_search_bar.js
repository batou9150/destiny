import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './group_search_bar.html';

Template.GroupSearchBar.events({
  'click .btn_search': function(evt, tpl) {
    var s = tpl.find('input#text_search').value;
    evt.preventDefault();
    FlowRouter.go('/group/search/:query', {'query':s});
  }
});