import { Template } from 'meteor/templating';

Template.registerHelper('formatDate', function(date) {
	return moment(date).format('DD-MM-YYYY');
});

Template.registerHelper('formatEpisodeNumber', function(season_number, episode_number) {
	retVal = 'S'
	if(season_number < 10)
		retVal += '0'
	retVal += season_number
	retVal += 'E'
	if(episode_number < 10)
		retVal += '0'
	retVal += episode_number
	return retVal;
});