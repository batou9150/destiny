FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('MainLayout', {main: 'Home'});
  }
});

FlowRouter.route('/group/search/:query', {
  name: 'group_search',
  action() {
    BlazeLayout.render('MainLayout', {main: 'GroupSearch'});
  }
});

FlowRouter.route('/group/:group_id', {
  name: 'group_detail',
  action() {
    BlazeLayout.render('MainLayout', {main: 'GroupDetail'});
  }
});

FlowRouter.route('/group/:group_id/stats/raid', {
  name: 'group_stats_raid',
  action() {
    BlazeLayout.render('MainLayout', {main: 'GroupStats'});
  }
});

FlowRouter.route('/group/:group_id/stats/exo/:exo_type', {
  name: 'group_stats_exo',
  action() {
    BlazeLayout.render('MainLayout', {main: 'GroupExo'});
  }
});